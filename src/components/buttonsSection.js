import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.min.css";

const ButtonsSection = ({ buttons, sectionClassName }) => {
  const [allButtons, setAllButtons] = useState(buttons);

  useEffect(() => {
    setAllButtons(buttons);
  }, [buttons]);

  return (
    <div className={sectionClassName}>
      {allButtons.map((button) => (
        <Button
          variant={button.variant}
          className={button.className}
          size={button.size}
          key={button.key}
          disabled={button.disabled}
          onClick={
            button.onClick
            //   () => {
            //   button.onClick(button.data);
            // }
          }
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};

export default ButtonsSection;
