import { Box, Button, Flex, useInterval } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { differenceInMilliseconds } from "date-fns";
import { format, zonedTimeToUtc } from "date-fns-tz";
import { useEffect, useRef, useState } from "react";
import { Colours } from "../ColourPicker";
import { Board } from "utils/interfaces";
import { FIVE_MINUTES_IN_SECONDS } from "components/RetroHome/RetroBody";
import { useAuthContext } from "context/Auth/AuthContext";

interface RetroTimerProps {
  board: Board;
}

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const RetroTimer = ({ board }: RetroTimerProps) => {
  const { userDetails } = useAuthContext();
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const intervalRef = useRef<any>();

  // console.log("board", board);

  // const snapshot = onSnapshot(
  //   doc(firestore, "boards", board.board_id),
  //   (doc) => {
  //     console.log("Current data: ", doc.data());
  //   }
  // );

  useEffect(() => {
    if (userDetails) {
      const q = query(
        collection(firestore, "boards"),
        where("createdBy.user_id", "==", userDetails.user_id)
      );

      const boardsCollectionSnap = onSnapshot(q, (snapshot) => {
        console.log("snapshot", snapshot.docs);
        const payload = snapshot.docs.map((doc) => {
          console.log(doc.data()?.timer?.startAt);
          const startAt = doc.data()?.timer?.startAt;
          const seconds = FIVE_MINUTES_IN_SECONDS;
          // const startAt = snapshot.val().startAt;
          const interval = setInterval(() => {
            const timeLeft = seconds * 1000 - (Date.now() - startAt);
            if (timeLeft < 0) {
              clearInterval(interval);
              console.log("0.0 left");
            } else {
              console.log(`${Math.floor(timeLeft / 1000)}.${timeLeft % 1000}`);
            }
          }, 1000);
          // return { ...doc.data(), doc_id: doc.id } as BoardWithDocId;
        });
        // setBoards(payload);
        // setLoading(false);
      });
      return boardsCollectionSnap;
    }
  }, [userDetails]);

  // if (board.timer?.startAt) {
  //   const endsAt = board.timer.startAt.seconds + FIVE_MINUTES_IN_SECONDS * 1000;

  //   const countDown = () => {
  //     setTime(Math.max(0, endsAt - Date.now()));
  //     console.log("timeLeft", timeLeft);
  //     if (endsAt <= Date.now()) {
  //       console.log("finsihed");
  //       clearInterval(intervalRef.current);
  //     }
  //   };

  //   const setTime = (remaining: number) => {
  //     console.log("remaining", remaining);
  //     var minutes = Math.floor(remaining / 60000);
  //     var seconds = Math.round(remaining / 1000);
  //     setTimeLeft(`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);
  //   };

  //   intervalRef.current = setInterval(countDown, 1000);
  // }

  // useEffect(() => {
  //   intervalRef.current = setInterval(() => {
  //     if (board.timer?.startAt) {
  //       const a = format(
  //         new Date(board.timer.startAt.seconds * 1000),
  //         "hh:mm:ss"
  //       );

  //       const result = differenceInMilliseconds(
  //         zonedTimeToUtc(
  //           new Date(),
  //           Intl.DateTimeFormat().resolvedOptions().timeZone
  //         ),
  //         new Date(board.timer.startAt.seconds * 1000)
  //       );
  //       console.log("result", result / 1000);
  //       const differenceInSeconds = result / 1000;

  //       if (differenceInSeconds >= 10) {
  //         console.log("time is up");
  //         clearInterval(intervalRef.current);
  //       }

  //       const minutes = Math.floor(differenceInSeconds / 60);

  //       // 👇️ get remainder of seconds
  //       const seconds = Math.trunc(differenceInSeconds % 60);

  //       setTimeLeft(`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);

  //       return () => {
  //         clearInterval(intervalRef.current);
  //       };
  //     }
  //     console.log("setinterval running");
  //   }, 1000);
  // }, [board.timer?.startAt]);

  const handleStartTimer = async () => {
    try {
      const ref = doc(firestore, "boards", board.board_id);

      await updateDoc(ref, {
        timer: {
          startAt: serverTimestamp(),
        },
      });

      setIsTimerStarted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleResetTimer = async () => {
    try {
      const ref = doc(firestore, "boards", board.board_id);

      await updateDoc(ref, {
        timer: {
          startAt: null,
        },
      });

      setIsTimerStarted(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex alignItems={"center"} justifyContent="space-between">
      {isTimerStarted && timeLeft && (
        <Box marginRight={"1rem"}>Retro starts in: {timeLeft}</Box>
      )}
      <Box>
        {isTimerStarted ? (
          <Button
            color={Colours.fireOpal}
            onClick={handleResetTimer}
            variant={"outline"}
          >
            Reset Timer
          </Button>
        ) : (
          <Button onClick={handleStartTimer}>Start Timer</Button>
        )}
      </Box>
    </Flex>
  );
};
