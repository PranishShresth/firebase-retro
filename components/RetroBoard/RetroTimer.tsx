import { Badge, Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { useInterval } from "hooks/useInterval";

import { firestore } from "configs/firebase/firestore";
import { zonedTimeToUtc } from "date-fns-tz";
import { useState } from "react";
import { Colours } from "../ColourPicker";
import { Board } from "utils/interfaces";
import { FIVE_MINUTES_IN_SECONDS } from "components/RetroHome/RetroBody";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsStopCircle } from "react-icons/bs";
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
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const hasTimerStarted = !!board?.timer?.startAt;

  console.log(hasTimerStarted);

  const icon = hasTimerStarted ? <BsStopCircle /> : <AiOutlineClockCircle />;
  const handleStartTimer = async () => {
    const ref = doc(firestore, "boards", board.board_id);
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
    const ref = doc(firestore, "boards", board.board_id);

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
      if (board.timer?.startAt) {
        const ref = doc(firestore, "boards", board.board_id);

        const endTime = new Date(
          board.timer.startAt.seconds * 1000 + FIVE_MINUTES_IN_SECONDS * 1000
        ).toUTCString();
        const { minutes, seconds, total } = getTimeRemaining(endTime);

        if (total <= 0) {
          clear();
          updateDoc(ref, {
            timer: {
              startAt: null,
            },
          });
        }
        setTimeLeft(`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);
      }
    },
    1000,
    [board.timer?.startAt]
  );
  const onClick = hasTimerStarted ? handleResetTimer : handleStartTimer;

  return (
    <Flex alignItems={"center"} justifyContent="space-between">
      {hasTimerStarted && (
        <Box marginRight={"1rem"}>
          <Badge colorScheme="red">{timeLeft}</Badge>
        </Box>
      )}
      <Box>
        <IconButton onClick={onClick} aria-label={"timer"} icon={icon} />
      </Box>
    </Flex>
  );
};
