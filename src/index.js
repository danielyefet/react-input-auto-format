import React, { useEffect, useRef, useState } from 'react';

function noop() {}

function format(value, pattern, placeholder = '#') {
  if (!pattern) return value;

  let endOfValue = 0;
  let characterIndex = 0;
  let newValue = value;

  return [...pattern]
    .map((patternCharacter, index) => {
      const character = newValue[characterIndex];
      const patternLength = pattern.length;

      if (!endOfValue) {
        if (index === patternLength - 1) endOfValue = patternLength;
        if (character === undefined)
          endOfValue = pattern.indexOf(placeholder, index);
      }

      if (patternCharacter === placeholder) {
        characterIndex = characterIndex + 1;
        return character;
      }

      return patternCharacter;
    })
    .splice(0, endOfValue)
    .join('');
}

function stripPatternCharacters(value) {
  return value.replace(/[^\dA-z]/g, '');
}

function Input({
  onChange = noop,
  onValueChange = noop,
  format: pattern,
  value: userValue = '',
  ...rest
}) {
  const [value, setValue] = useState(userValue);
  const inputRef = useRef();
  const infoRef = useRef({});

  function handleChange(event) {
    const { target } = event;
    const { value: inputValue, selectionStart: cursorPosition } = target;
    const didDelete = inputValue.length < value.length;

    infoRef.current.cursorPosition = cursorPosition;

    let rawValue = stripPatternCharacters(inputValue);

    if (didDelete) {
      const nonNumericWasDeleted = /[^\dA-z]/.test([...value][cursorPosition]);

      if (nonNumericWasDeleted) {
        const firstBit = inputValue.substr(0, cursorPosition);
        const rawFirstBit = stripPatternCharacters(firstBit);

        rawValue =
          rawFirstBit.substr(0, rawFirstBit.length - 1) +
          stripPatternCharacters(
            inputValue.substr(cursorPosition, inputValue.length)
          );

        infoRef.current.cursorPosition =
          firstBit.replace(/([\d\w]+)[^\dA-z]+$/, '$1').length - 1;
      }
    }

    const formattedValue = format(rawValue, pattern);

    infoRef.current.formattingWasAdded =
      formattedValue.length - value.length > 1;

    onValueChange(rawValue);
    onChange(event);
    setValue(formattedValue);
  }

  useEffect(() => {
    const { cursorPosition, formattingWasAdded } = infoRef.current;

    if (!formattingWasAdded)
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
  }, [value]);

  return (
    <input
      maxLength={pattern && pattern.length}
      onChange={handleChange}
      ref={inputRef}
      value={value}
      {...rest}
    />
  );
}

export default Input;
