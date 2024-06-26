import * as React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import Container from "../components/Container";
import IcInstagram from "../components/IcInstagram";
import IcLinkedIn from "../components/IcLinkedIn";
import IcSettings from "../components/ICSettings";
import ICTwitter from "../components/IcTwitter";
import Logo from "../components/Logo";
import Section, { Props as SectionProps } from "../components/Section";
import Tab, { TabItem } from "../components/Tab";
import { Domains } from "../utils/constants";

import "./common.css";

const SECTIONS: (SectionProps & { comp: JSX.Element })[] = [
  // {
  //   title: "OpenAI Model",
  //   desc: "Model to use for OpenAI API. text-davinci-003 produces higher quality writing.",
  //   comp: <ModelOptions />,
  // },
];

const TABS: TabItem[] = [
  {
    title: "Settings",
    comp: (
      <>
        {SECTIONS.map((section, i) => {
          const { comp, ...rest } = section;
          return (
            <Section key={section.title + i} {...rest}>
              {comp}
            </Section>
          );
        })}
      </>
    ),
    icon: <IcSettings />,
  },
];

export const Main = styled.div`
  margin: 24px 0;
`;

const Options = () => {
  return (
    <Container>
      <Logo />

      {/* Tabs */}
      <Main>
        <Tab tabs={TABS} />
      </Main>

      {/* Copyright */}
      <p>
        <a href="https://social-comments-gpt.com/" target="_blank">
          social-comments-gpt.com
        </a>{" "}
        &copy; 2022
      </p>

      {/* Credits */}
      <p>
        Made with ❤️ by{" "}
        <a href="https://chcepe.github.io/" target="_blank">
          chcepe
        </a>
      </p>
    </Container>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
