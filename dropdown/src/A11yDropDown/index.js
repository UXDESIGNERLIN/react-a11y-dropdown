import PropTypes from "prop-types";
import React, { useState, useEffect, useLayoutEffect } from "react";

import KEY_CODES from "./KeyCodes";
import {
  handleListKeyUp,
  handleButtonKeyUp,
  adjustScrollPosition
} from "./Utils";
import onClickOutside from "react-onclickoutside";
import {
  Control,
  ControlField,
  Trigger,
  AutoComplete,
  TriggerIcon,
  ControlList,
  ListItem
} from "./styleComponent";

const A11yDropDown = function ({
  id,
  label,
  options,
  placeholder,
  defaultSelectedValue,
  onSelect,
  ...props
}) {
  const defaultSelectedIndex = options.indexOf(defaultSelectedValue);
  const [inputValue, setInputValue] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [lastSelectedValue, setLastSelectedValue] = useState(
    defaultSelectedIndex
  );
  const [activeIndex, setActiveIndex] = useState(lastSelectedValue);
  const [statusOnMouseDown, setStatusOnMouseDown] = useState(false);
  const [colorEffect, setColorEffect] = useState(activeIndex);
  const inputRef = React.createRef();
  options = sortOptions(options);
  A11yDropDown.handleClickOutside = () => {
    reset();
    setIsActive(false);
  };

  useLayoutEffect(function () {
    if (isActive) {
      if (activeIndex < 0) {
        adjustScrollPosition(`${id}-list`, `${id}-item-${lastSelectedValue}`);
      } else if (activeIndex >= 0 && activeIndex !== null) {
        adjustScrollPosition(`${id}-list`, `${id}-item-${activeIndex}`);
      } else if (activeIndex === null) {
        return;
      }
    }
  });

  function focusTriggerButton(id) {
    document.getElementById(`${id}-input`).focus();
  }

  function getActiveItem(index, options, placeholder) {
    return index < 0 ? { label: placeholder } : options[index];
  }

  function getSelectedItem(index, options, placeholder) {
    return index < 0 ? { label: placeholder } : options[index];
  }

  function sortOptions(options) {
    let newOptions = options
      .map(item => {
        return item.toLowerCase();
      })
      //sort the whole array
      .sort(function (a, b) {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      })
      .map(item => {
        item = item.split("");
        item[0] = item[0].toUpperCase();
        item = item.join("");
        return item;
      });

    return newOptions;
  }

  function filterOptions(options = [], filter, exclude = []) {
    return options.filter(option => {
      const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0;

      return matches && exclude.indexOf(option) < 0;
    });
  }

  function onActivate() {
    setIsActive(true);
    setColorEffect(false);
  }

  function onOptionClick(o, i) {
    onItemSelect(o);
    setActiveIndex(i);
    setLastSelectedValue(i);
  }

  function onItemSelect(item) {
    if (isActive === false) {
      return;
    }

    if (item) {
      setIsActive(false);
      setTimeout(() => focusTriggerButton(id), 100);
      onSelect && onSelect(item);
    }
  }

  function onBlur() {
    if (lastSelectedValue !== activeIndex) {
      setActiveIndex(lastSelectedValue);
    }

    reset();
  }

  function setActiveItem(newIndex) {
    let idx = newIndex;
    if (idx >= options.length) {
      idx = 0;
    } else if (idx < 0) {
      idx = options.length - 1;
    }

    setActiveIndex(idx);

    adjustScrollPosition(`${id}-list`, `${id}-item-${idx}`);
  }

  function onKeyDown(e) {
    e.stopPropagation();

    switch (e.key) {
      case KEY_CODES.RETURN:
        if (!isActive) {
          onActivate();

          lastSelectedValue === -1 && setActiveIndex(defaultSelectedIndex);
          return;
        }
        onOptionClick(
          getActiveItem(activeIndex, options, placeholder),
          activeIndex
        );
        setInputValue("");

        break;
      case KEY_CODES.SPACE:
        if (!isActive) {
          onActivate();

          lastSelectedValue === -1 && setActiveIndex(defaultSelectedIndex);
          return;
        }

        break;
      case KEY_CODES.DOWN:
        if (!isActive) {
          onActivate();
          lastSelectedValue === -1 && setActiveIndex(defaultSelectedIndex);

          return;
        }
        getSelectedItem(lastSelectedValue, options, placeholder);

        setActiveItem(activeIndex + 1);
        setColorEffect(false);

        break;
      case KEY_CODES.UP:
        setActiveItem(activeIndex - 1);
        setColorEffect(false);
        getSelectedItem(lastSelectedValue, options, placeholder);

        break;
      case KEY_CODES.END:
        setActiveItem(options.length - 1);

        break;
      case KEY_CODES.HOME:
        setActiveItem(0);

        break;
      case KEY_CODES.ESC:
        e.stopPropagation();
        e.preventDefault();
        setIsActive(false);
        reset();
        e.stopPropagation();

        break;
      case KEY_CODES.TAB:
        setIsActive(false);
        reset();

        break;
      default:
        break;
    }
  }

  function reset(isFocusTriggerRequired) {
    setInputValue("");
    const idx = activeIndex;
    adjustScrollPosition(`${id}-list`, `${id}-item-${idx}`);

    if (isFocusTriggerRequired) {
      setActiveIndex(lastSelectedValue);
    }
    setIsActive(false);
  }

  function handleOnChange(e) {
    setInputValue(e.target.value.trim());
    setIsActive(true);
    const matches = filterOptions(options, e.target.value);
    if (e.target.value === "") {
      setActiveIndex(lastSelectedValue);
      setColorEffect(lastSelectedValue);
    } else if (matches.length >= 1) {
      const index = options.indexOf(...matches);
      if (activeIndex === index) {
        setColorEffect(index);
        setActiveIndex(null);

        document
          .getElementById(`${id}-input`)
          .removeAttribute("aria-autocomplete");
        setTimeout(() => {
          setActiveIndex(index);
        }, 100);
      } else {
        setActiveIndex(index);
        setColorEffect(index);
      }
    } else
      document
        .getElementById(`${id}-input`)
        .setAttribute("aria-autocomplete", "list");
  }

  return (
    <Control
      isActive={isActive}
      className="control"
      onMouseDown={() => {
        setStatusOnMouseDown(isActive);
      }}
    >
      <ControlField className="control__field">
        <Trigger
          aria-expanded={isActive}
          className="control__field-input"
          aria-haspopup="listbox"
        >
          <AutoComplete
            ref={inputRef}
            aria-activedescendant={`${id}-item-${activeIndex}`}
            autoComplete="off"
            onChange={e => handleOnChange(e)}
            id={`${id}-input`}
            aria-autocomplete="list"
            onClick={() => {
              if (!statusOnMouseDown) {
                onActivate();
              } else {
                setIsActive(false);
              }
            }}
            onKeyUp={e => handleButtonKeyUp(e)}
            onKeyDown={e => onKeyDown(e)}
            value={inputValue}
            placeholder={options[lastSelectedValue]}
            aria-label={`${id}${options[lastSelectedValue]} is selected`}
          />{" "}
        </Trigger>
        <TriggerIcon
          role="presentation"
          aria-hidden="true"
          onClick={() => {
            inputRef.current.focus();
            if (!statusOnMouseDown) {
              onActivate();
            } else {
              setIsActive(false);
            }
          }}
          onKeyUp={e => handleButtonKeyUp(e)}
          onKeyDown={e => onKeyDown(e)}
        />

        <ControlList
          up={props.up || false}
          id={`${id}-list`}
          options={options.length}
          className="list"
          tabIndex="-1"
          role="listbox"
          aria-activedescendant={`${id}-item-${activeIndex}`}
          onKeyUp={e => handleListKeyUp(e)}
          onKeyDown={e => onKeyDown(e)}
          onBlur={e => onBlur(e)}
        >
          {" "}
          {options.map((o, i) => (
            <ListItem
              key={`${id}-${o}`}
              onMouseEnter={() => {
                setActiveIndex(i);
                setColorEffect(false);
              }}
              onMouseLeave={() => {
                setActiveIndex(i);
                setColorEffect(false);
              }}
              id={`${id}-item-${i}`}
              className={`list__item ${
                i === activeIndex ? "list__item--active" : ""
              }`}
              role="option"
              name="sourceLanguage"
              isActive={i === activeIndex}
              isSelected={i === lastSelectedValue}
              aria-selected={i === activeIndex}
              onClick={() => onOptionClick(o, i)}
              colorEffect={i === colorEffect}
            >
              {o}
            </ListItem>
          ))}
        </ControlList>
      </ControlField>
    </Control>
  );
};

A11yDropDown.defaultProps = {
  label: ""
};
A11yDropDown.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string
};

const clickOutsideConfig = {
  handleClickOutside: () => A11yDropDown.handleClickOutside
};
export default onClickOutside(A11yDropDown, clickOutsideConfig);
