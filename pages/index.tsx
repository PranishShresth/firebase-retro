import { NextPage } from "next";
import { db } from "../configs/firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useEffect } from "react";
const Home: NextPage = () => {
  const addSomething = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    async function getDocs1() {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.docs.forEach((doc) => {
        console.log(doc.data());
      });
    }
    getDocs1();
  }, []);
  return (
    <>
      <button onClick={addSom ething}>Add Button</button>
    </>
  );
};

export default Home;
