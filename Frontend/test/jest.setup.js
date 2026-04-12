import { TextDecoder, TextEncoder } from "node:util";

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

import "@testing-library/jest-dom";

jest.mock("framer-motion", () => {
  const React = require("react");

  function stripMotionProps(props) {
    const {
      layout,
      layoutId,
      initial,
      animate,
      exit,
      transition,
      whileHover,
      whileTap,
      variants,
      ...rest
    } = props;
    return rest;
  }

  function motionTag(Tag) {
    return React.forwardRef((props, ref) => {
      const next = stripMotionProps(props);
      return React.createElement(Tag, { ...next, ref }, props.children);
    });
  }

  return {
    motion: {
      div: motionTag("div"),
      button: motionTag("button"),
      article: motionTag("article"),
    },
    AnimatePresence: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});
