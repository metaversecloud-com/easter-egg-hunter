import React, { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";

// pages
import { Error, Home } from "@pages";

// utils
import { backendAPI } from "@utils";

// context
import { setInteractiveParams, setLeaderboardData, setVisitorInfo, setWorldInfo, useGlobalDispatch } from "@context";
import { setupBackendAPI } from "../utils/backendAPI";
import { getLeaderboardData } from "../utils/leaderboard";
import { EggClicked } from "../pages";

export function App() {
  const [searchParams] = useSearchParams();
  const [hasInitBackendAPI, setHasInitBackendAPI] = useState(false);

  // context
  const globalDispatch = useGlobalDispatch();

  useEffect(() => {
    const interactiveParams = {
      assetId: searchParams.get("assetId"),
      interactiveNonce: searchParams.get("interactiveNonce"),
      interactivePublicKey: searchParams.get("interactivePublicKey"),
      visitorId: searchParams.get("visitorId"),
      urlSlug: searchParams.get("urlSlug"),
    };

    if (interactiveParams.assetId) {
      setInteractiveParams({
        dispatch: globalDispatch,
        ...interactiveParams,
      });
    }

    const setupAPI = async () => {
      await setupBackendAPI(interactiveParams);
      setHasInitBackendAPI(true);
    };
    if (!hasInitBackendAPI) setupAPI();
  }, [globalDispatch, hasInitBackendAPI, searchParams]);

  // Get Visitor info
  useEffect(() => {
    const getVisitor = async () => {
      const result = await backendAPI.get("/visitor");
      console.log(result);
      if (result.data.success) {
        setVisitorInfo({
          dispatch: globalDispatch,
          visitor: result.data.visitor,
        });
      } else {
        console.log("Error getting visitor", result.data.error);
      }
    };
    if (hasInitBackendAPI) getVisitor();
  }, [globalDispatch, hasInitBackendAPI]);

  // Get Visitor info
  useEffect(() => {
    const getWorld = async () => {
      const result = await backendAPI.get("/world");
      console.log(result);
      if (result.data.success) {
        console.log(result.data.world);
        setWorldInfo({
          dispatch: globalDispatch,
          world: result.data.world,
        });
      } else {
        console.log("Error getting world", result.data.error);
      }
    };
    if (hasInitBackendAPI) getWorld();
  }, [globalDispatch, hasInitBackendAPI]);

  useEffect(() => {
    if (hasInitBackendAPI) getLeaderboardData({ setLeaderboardData, globalDispatch });
  }, [globalDispatch, hasInitBackendAPI]);

  return (
    <Routes>
      {/* {routes.map((route, index) => {
        return <Route element={<route.component />} key={index} path={route.path} />
      })} */}
      <Route element={<Home />} exact path="/" />
      <Route element={<EggClicked />} exact path="/egg-clicked" />
      <Route element={<Error />} exact path="*" />
    </Routes>
  );
}

export default App;
