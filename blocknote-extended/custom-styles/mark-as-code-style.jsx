import { createReactStyleSpec } from "@blocknote/react";

// The mark as code style.
export const MarkAsCodeStyle = createReactStyleSpec(
  {
    type: "markAsCodeStyle",
    propSchema: "string",
  },
  {
    render: (props) => (
      <span
        style={{
          padding: "6px",
          color: "#EB5757",
          background: "#EDEDEB",
          borderRadius: "5px",
          fontSize: props.value,
          caretColor: "black",
        }}
        ref={props.contentRef}
      />
    ),
  }
);
