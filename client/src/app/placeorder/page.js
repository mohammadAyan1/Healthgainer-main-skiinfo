"use client";

import React from "react";
import PlaceOrderForm from "@/components/PlaceOrderForm";
import { useSelector } from "react-redux";
import { useRouteHistory } from "@/context/RouteContext";

const Page = () => {
  const { showPlaceOrder } = useRouteHistory();

  const user = useSelector((state) => state.auth.user);

  //   return <>{!user && showPlaceOrder && <PlaceOrderForm />}</>;
  return (
    <>
      <PlaceOrderForm />
    </>
  );
};

export default Page;
