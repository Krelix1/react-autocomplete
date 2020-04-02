import React, { useState, useEffect, useRef } from "react";

import "./index.scss";

function AutoComplete({
  onAutoCompleteChange = () => {},
  className = "",
  autoComplete = "off",
  options: initOptions = [],
  value = "",
  readOnly = false,
  title = "",
  placeholder = ""
}) {
  const [isShowOptions, setIsShowOptions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState([]);
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const ulRef = useRef(null);

  const clearAll = () => {
    setInputValue("");
    setOptions(initOptions);
  };

  const showOptions = () => {
    setIsShowOptions(true);
  };

  const onInputChange = ev => {
    const str = ev.target.value;
    setInputValue(str);
    let filteredOptions = initOptions.filter(option => {
      return !!option.name.toLowerCase().includes(str.toLowerCase());
    });
    str ? setOptions(filteredOptions) : setOptions(initOptions);

    const findedOption = initOptions.find(option => option.name === str);

    const autoSelectValue = findedOption ? findedOption : str;
    onAutoCompleteChange(autoSelectValue);
  };

  const selectOption = ev => {
    const index = ev.target.dataset.option;
    const option = options[index];
    setInputValue(option.name);
    setIsShowOptions(false);
    onAutoCompleteChange(option);
  };

  const optionsLi = options.map((option, index) => {
    return (
      <li key={option.id} data-option={index} tabIndex={index}>
        {option.name}
      </li>
    );
  });

  const arrowDown = ev => {
    ev.preventDefault();
    const listItems = ulRef.current.querySelectorAll("li");
    if (!listItems[index + 1]) return;
    listItems[index + 1].focus();
    setIndex(index + 1);
  };

  const arrowUp = ev => {
    ev.preventDefault();
    const listItems = ulRef.current.querySelectorAll("li");
    if (!listItems[index - 1]) return;
    listItems[index - 1].focus();
    setIndex(index - 1);
  };

  const enter = ev => {
    ev.preventDefault();
    const option = options[index];
    setInputValue(option.name);
    setIsShowOptions(false);
    onAutoCompleteChange(option);
  };

  const onKeyDownOptions = ev => {
    switch (ev.nativeEvent.code) {
      case "ArrowDown":
        arrowDown(ev);
        break;
      case "ArrowUp":
        arrowUp(ev);
        break;
      case "Enter":
        enter(ev);
        break;
      default:
        return;
    }
  };

  const onKeyDown = ev => {
    if (ev.nativeEvent.code !== "ArrowDown") return;
    ev.preventDefault();
    const el = ulRef.current.querySelector("li");
    el.focus();
    setIndex(0);
  };

  useEffect(() => {
    setOptions(initOptions);
  }, [initOptions]);

  useEffect(() => {
    const hideAutoSelect = ev => {
      if (inputRef.current && inputRef.current.contains(ev.target)) return null;
      setIsShowOptions(false);
    };

    const rootElement = document.getElementById("root");
    rootElement.addEventListener("click", hideAutoSelect);

    return () => {
      rootElement.removeEventListener("click", hideAutoSelect);
    };
  }, []);

  return (
    <div className={`auto-complete-input ${className}`} ref={inputRef}>
      {title && <label htmlFor="auto-complete-input input">{title}</label>}
      <div className="input-wrapper">
        <input
          id="auto-complete-input input"
          autoComplete={autoComplete}
          onClick={showOptions}
          value={inputValue}
          onChange={onInputChange}
          onFocus={onInputChange}
          readOnly={readOnly}
          className="input"
          placeholder={placeholder}
          onKeyDown={onKeyDown}
        />
        <i className="fas fa-times close-icon" onClick={clearAll}></i>
      </div>
      <ul
        className={`options ${isShowOptions && options.length ? "show" : ""}`}
        ref={ulRef}
        onClick={selectOption}
        onKeyDown={onKeyDownOptions}
      >
        {optionsLi}
      </ul>
    </div>
  );
}

export default AutoComplete;
