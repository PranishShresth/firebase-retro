import { Box, Button, IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { FIVE_MINUTES_IN_SECONDS } from "components/RetroHome/RetroBody";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { zonedTimeToUtc } from "date-fns-tz";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useInterval } from "hooks/useInterval";
import { useState } from "react";
import { BsStopCircle } from "react-icons/bs";
import { IoMdAlarm } from "react-icons/io";
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

const initState = { minutes: 0, seconds: 0, total: 0 };

export const RetroTimer = ({ board }: RetroTimerProps) => {
  const { user } = useAuthContext();
  const [time, setTimeLeft] = useState<typeof initState>(initState);

  const { total, minutes, seconds } = time;
  const toast = useToast();
  const allowStartStopTimer = user?.uid === board.userId;
  const width = (total / (FIVE_MINUTES_IN_SECONDS * 1000)) * 100;

  const hasTimerStarted = !!board?.prefs.timer?.startAt;

  const showTimer = hasTimerStarted;

  const showTimerControl = allowStartStopTimer && !hasTimerStarted;

  const icon = hasTimerStarted ? (
    <BsStopCircle fill={Colours.fireOpal} />
  ) : (
    <IoMdAlarm />
  );

  const handleStartTimer = async () => {
    const ref = doc(firestore, "boards", board.boardId);
    try {
      await setDoc(
        ref,
        {
          prefs: {
            timer: {
              startAt: serverTimestamp(),
            },
          },
        },
        { merge: true }
      );

      await clear();
    } catch (err) {
      console.log(err);
    }
  };

  const handleResetTimer = async () => {
    const ref = doc(firestore, "boards", board.boardId);

    try {
      await setDoc(
        ref,
        {
          prefs: {
            timer: {
              startAt: null,
            },
          },
        },
        { merge: true }
      );
      setTimeLeft(initState);
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
          setDoc(
            ref,
            {
              prefs: {
                timer: {
                  startAt: null,
                },
              },
            },
            { merge: true }
          );

          toast({
            title: "Time's Up!",
            description: "Retro will start shortly...",
            status: "warning",
            duration: 4000,
            isClosable: true,
          });
        }
        setTimeLeft({ seconds, minutes, total });
      }
    },
    1000,
    [board.prefs.timer?.startAt]
  );

  return (
    <>
      {showTimer && (
        <Tooltip bg="gray.300" color="black" hasArrow label={"Stop Timer"}>
          <Button
            variant="outline"
            leftIcon={<IoMdAlarm fontSize={24} />}
            borderColor="#EE2B02"
            borderWidth="2px"
            position="relative"
            onClick={handleResetTimer}
          >
            {`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`} remaining
            <Box
              position="absolute"
              top="0"
              left="0"
              width={`${width}%`}
              height="100%"
              background="rgba(254, 186, 172,0.3)"
            ></Box>
          </Button>
        </Tooltip>
      )}

      {showTimerControl && (
        <Tooltip bg="gray.300" color="black" hasArrow label={"Start Timer"}>
          <Box>
            <IconButton
              onClick={handleStartTimer}
              aria-label={"timer"}
              icon={icon}
              variant="outline"
            />
          </Box>
        </Tooltip>
      )}
    </>
  );
};
