import { RetroHeader, RetroBody } from "components/RetroHome";

import { NextPage } from "next";

import React from "react";

const RetroDashboard: NextPage = () => {
  return (
    <div>
      <RetroHeader />
      <RetroBody />
    </div>
  );
};

export default RetroDashboard;
