import React from "react";
import {
  CalculateMetadataFunction,
  Composition,
  AbsoluteFill,
  Sequence,
} from "remotion";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneProblem } from "./scenes/SceneProblem";
import { SceneDashboard } from "./scenes/SceneDashboard";
import { SceneFeatures } from "./scenes/SceneFeatures";
import { SceneJourney } from "./scenes/SceneJourney";
import { SceneEducation } from "./scenes/SceneEducation";
import { SceneTrust } from "./scenes/SceneTrust";
import { SceneOutro } from "./scenes/SceneOutro";

type Props = {};

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

export const MyComponent: React.FC<Props> = () => {
  return (
    <AbsoluteFill className="bg-[#111111] overflow-hidden w-full h-full relative">
      <Sequence durationInFrames={150} name="Scene 1: Hook">
        <SceneIntro />
      </Sequence>
      <Sequence from={150} durationInFrames={150} name="Scene 2: The Problem">
        <SceneProblem />
      </Sequence>
      <Sequence
        from={300}
        durationInFrames={240}
        name="Scene 3: Solution / Dashboard"
      >
        <SceneDashboard />
      </Sequence>
      <Sequence from={540} durationInFrames={300} name="Scene 4: Features">
        <SceneFeatures />
      </Sequence>
      <Sequence from={840} durationInFrames={300} name="Scene 5: Investing Journey">
        <SceneJourney />
      </Sequence>
      <Sequence from={1140} durationInFrames={240} name="Scene 6: Education">
        <SceneEducation />
      </Sequence>
      <Sequence from={1380} durationInFrames={240} name="Scene 7: Trust">
        <SceneTrust />
      </Sequence>
      <Sequence from={1620} durationInFrames={180} name="Scene 8: Call to Action">
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={1800}
      fps={30}
      width={1920}
      height={1080}
      calculateMetadata={calculateMetadata}
    />
  );
};
