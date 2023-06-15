import {
  Badge,
  Box,
  Flex,
  IconButton,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FIVE_MINUTES_IN_SECONDS } from "components/RetroHome/RetroBody";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { zonedTimeToUtc } from "date-fns-tz";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useInterval } from "hooks/useInterval";
import { useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsStopCircle } from "react-icons/bs";
import { Board } from "utils/interfaces";
import { Colours } from "../../ColourPicker";

interface RetroTimerProps {
  board: Board;
}
function getTimeRemaining(endtime: string) {
  const currentTime = zonedTimeToUtc(
    new Date(),
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ).toUTCString();

  const total = Date.parse(endtime) - Date.parse(currentTime);
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}
const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const RetroTimer = ({ board }: RetroTimerProps) => {
  const { user } = useAuthContext();
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const toast = useToast();
  const allowStartStopTimer = user?.uid === board.userId;

  const hasTimerStarted = !!board?.prefs.timer?.startAt;

  const icon = hasTimerStarted ? (
    <BsStopCircle fill={Colours.fireOpal} />
  ) : (
    <AiOutlineClockCircle />
  );
  const handleStartTimer = async () => {
    const ref = doc(firestore, "boards", board.boardId);
    try {
      await updateDoc(ref, {
        timer: {
          startAt: serverTimestamp(),
        },
      });
      clear();
    } catch (err) {
      console.log(err);
    }
  };

  const handleResetTimer = async () => {
    const ref = doc(firestore, "boards", board.boardId);

    try {
      await updateDoc(ref, {
        timer: {
          startAt: null,
        },
      });
      setTimeLeft("");
    } catch (err) {
      console.log(err);
    }
  };

  const clear = useInterval(
    () => {
      if (board.prefs.timer?.startAt) {
        const ref = doc(firestore, "boards", board.boardId);

        const endTime = new Date(
          board.prefs.timer.startAt.seconds * 1000 +
            FIVE_MINUTES_IN_SECONDS * 1000
        ).toUTCString();

        const { minutes, seconds, total } = getTimeRemaining(endTime);

        if (total <= 0) {
          clear();
          updateDoc(ref, {
            timer: {
              startAt: null,
            },
          });

          toast({
            title: "Time's Up!",
            description: "Retro will start shortly...",
            status: "warning",
            duration: 4000,
            isClosable: true,
          });
        }
        setTimeLeft(`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);
      }
    },
    1000,
    [board.prefs.timer?.startAt]
  );
  const onClick = hasTimerStarted ? handleResetTimer : handleStartTimer;

  return (
    <Flex alignItems={"center"} justifyContent="space-between">
      {hasTimerStarted && (
        <Box marginRight={"1rem"}>
          <Badge colorScheme="red" fontSize="lg">
            {timeLeft}
          </Badge>
        </Box>
      )}

      {allowStartStopTimer && (
        <Tooltip
          bg="gray.300"
          color="black"
          hasArrow
          label={hasTimerStarted ? "Reset Timer" : "Start Timer"}
        >
          <Box>
            <IconButton onClick={onClick} aria-label={"timer"} icon={icon} />
          </Box>
        </Tooltip>
      )}
    </Flex>
  );
};
