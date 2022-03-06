import { RetroHeader, RetroBody } from "components/RetroHome";

import { NextPage } from "next";
import Head from "next/head";

import React from "react";

const RetroDashboard: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Retro Board</title>
      </Head>
      <RetroHeader />
      <RetroBody />
    </div>
  );
};

export default RetroDashboard;
