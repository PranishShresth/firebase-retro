import { firestore } from "configs/firebase/firestore";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Board } from "utils/interfaces";

const RETRO_ID = "99d94a92-215c-4d13-af6d-ccaaceee4c75";

const RedirectToLatest = () => {
  const router = useRouter();

  useEffect(() => {
    (async function redirect() {
      const q = query(
        collection(firestore, "boards"),
        where("workspaceId", "==", RETRO_ID),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      try {
        const snap = await getDocs(q);
        const [doc] = snap.docs.map((a) => a.data()) as [Board];
        router.push(`/board/${doc.boardId}`);
      } catch (e) {
        console.log("Unable to redirect", e);
      }
    })();
  }, [router]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image src="/pikachu.gif" alt="logo" width={300} height={200} />
      </div>
    </>
  );
};

export default RedirectToLatest;
