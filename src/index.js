import React, { useEffect, useRef, useState } from 'react';

// CHANGE: Moved placeholder declaration from format() to global scope 
// REASON: So that the <Input> component can access it too
const placeholder = '#';
// CHANGE: Added a variable holding the RegExp object that is used after deletion to check whether there are pattern characters at the end of the substring
// REASON: To minimize the amount of times that RegExp object has to be reinitialized
let regexForStrippableCharacterAtTheEnd;

function noop() {}

function format(value, pattern) {
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

// CHANGE: allow passing custom regex into the function
function stripPatternCharacters(value, regex) {
  return value.replace(regex, '');
}

// CHANGE: allow passing custom regex
// CHANGE: renamed the function to describe its function accurately even when it's used to check for stripRegex
function matchesRegex(character, regex) {
  return regex.test(character);
}

function Input({
  onChange = noop,
  onValueChange = noop,
  format: pattern,
  value: userValue = '',
  strip: stripRegex = /[^\dA-z]/g,
  allow: allowRegex = /[\dA-z]/,
  ...rest
}) {
  const [value, setValue] = useState(format(userValue, pattern));
  const inputRef = useRef();
  const infoRef = useRef({});


  function handleChange(event) {
    const { target } = event;
    const { value: inputValue, selectionStart: cursorPosition } = target;
    const didDelete = inputValue.length < value.length;

    // CHANGE: Now the handler double-checks whether the cursor's position is located before the first placeholder in the input string
    // REASON: Otherwise characters will be inserted out of order with a pattern like "+7 (###) ###-##-##" and cursorPosition < 5
    const firstPlaceholderPosition = pattern.search(placeholder);
    let cursorWasBeforeFirstPlaceholder = false;
    if (cursorPosition >= firstPlaceholderPosition) {
        // If the cursor's position is after the first placeholder, pass its position to infoRef unchanged
        infoRef.current.cursorPosition = cursorPosition;
    } else {
        // If the cursor's position is located before the first placeholder,
        // move cursor to the location of the first placeholder
        cursorWasBeforeFirstPlaceholder = true;
        infoRef.current.cursorPosition = firstPlaceholderPosition + 1;
    }
    // After all of this is done, read actual cursor position from infoRef for further use
    const updatedCursorPosition = infoRef.current.cursorPosition;

    let rawValue = stripPatternCharacters(inputValue, stripRegex);

    // Processing the value after deletion
    if (didDelete) {
      // CHANGE: now patternCharacterDeleted checks whether the deleted character is included in stripRegex, not whether it's excluded from allowRegex
      // REASON: this procedure matches its meaning more closely and allows for greater customizability

      // Check whether the user has deleted a pattern character (one that is included in the stripRegex)
      const patternCharacterDeleted = matchesRegex(
        [...value][updatedCursorPosition],
        stripRegex
      );

      // If the user has deleted a pattern character, delete the character immediately preceding it as well
      if (patternCharacterDeleted) {
        const firstBit = inputValue.substr(0, updatedCursorPosition);
        const rawFirstBit = stripPatternCharacters(firstBit, stripRegex);

        rawValue =
          rawFirstBit.substr(0, rawFirstBit.length - 1) +
          stripPatternCharacters(
            inputValue.substr(updatedCursorPosition, inputValue.length),
            stripRegex
          );

        if (!regexForStrippableCharacterAtTheEnd) {
            regexForStrippableCharacterAtTheEnd = new RegExp(`(${allowRegex.source}+)${stripRegex.source}+$`);
        }
        infoRef.current.cursorPosition =
          firstBit.replace(regexForStrippableCharacterAtTheEnd, '$1').length - 1;
      }
    }

    const formattedValue = format(rawValue, pattern);

    infoRef.current.endOfSection = false;

    if (!didDelete) {
      const formattedCharacters = [...formattedValue];
      const nextCharacter = formattedCharacters[updatedCursorPosition];
      const nextCharacterIsPattern = matchesRegex(nextCharacter, stripRegex);
      const nextUserCharacterIndex = formattedValue
        .substr(updatedCursorPosition)
        .search(allowRegex);
      const numbersAhead = nextUserCharacterIndex !== -1;

      infoRef.current.endOfSection = nextCharacterIsPattern && !numbersAhead;

      if (
        nextCharacterIsPattern &&
        !matchesRegex(formattedCharacters[updatedCursorPosition - 1], allowRegex) &&
        numbersAhead
      )
        infoRef.current.cursorPosition =
          updatedCursorPosition + nextUserCharacterIndex + 1;
    }

    onValueChange(rawValue);
    onChange(event);
    setValue(formattedValue);
  }

  useEffect(() => {
    const { cursorPosition, endOfSection } = infoRef.current;

    if (endOfSection) return;

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
