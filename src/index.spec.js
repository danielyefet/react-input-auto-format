import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Input from '.';

describe('The Input component', () => {
  function getInput(props) {
    return render(<Input type="text" {...props} />).getByRole('textbox');
  }

  it('should render', () => {
    expect(getInput().value).toBe('');
  });

  it('should accept a default value', () => {
    expect(getInput({ value: 'foo' }).value).toBe('foo');
  });

  it('should format the default value', () => {
    expect(getInput({ value: 'foo', format: '# - # - #' }).value).toBe(
      'f - o - o'
    );
  });

  it('should format while typing', () => {
    const input = getInput({ format: '## - ## - ##' });

    userEvent.type(input, '12');

    expect(input.value).toBe('12 - ');
  });

  it('should broadcast the raw value', () => {
    const handleValueChange = jest.fn();

    const input = getInput({
      format: '# - # - #',
      onValueChange: handleValueChange,
    });

    userEvent.type(input, '123');

    expect(handleValueChange).toBeCalledWith('123');
  });

  it.each`
    format            | type        | moveCursorTo | typeAgain        | cursorPosition
    ${'## - ##'}      | ${'12'}     | ${null}      | ${null}          | ${5}
    ${'## - ## - ##'} | ${'12345'}  | ${3}         | ${'1'}           | ${6}
    ${'## - ## - ##'} | ${'123456'} | ${null}      | ${'{backspace}'} | ${11}
    ${'## - ## - ##'} | ${'123456'} | ${7}         | ${'{backspace}'} | ${6}
    ${'## - ## - ##'} | ${'123456'} | ${4}         | ${'{backspace}'} | ${1}
  `(
    'should position the cursor correctly',
    ({ format, type, typeAgain, moveCursorTo, cursorPosition }) => {
      const input = getInput({ format });

      userEvent.type(input, type);

      if (moveCursorTo) input.setSelectionRange(moveCursorTo, moveCursorTo);
      if (typeAgain) userEvent.type(input, typeAgain);

      expect(input.selectionStart).toBe(cursorPosition);
    }
  );

  it('should use custom RegExp objects correctly', () => {    
    const input = getInput({
      format: '+1 (###) ###-##-##',
      strip: /^(\+1)|[^\d]/g,
      allow: /\d/g,
    });

    userEvent.type(input, 'a950123a4!(-812'),
    expect(input.value).toBe('+1 (950) 123-48-12');
  });

  it('should input numbers in the correct order with a pattern that includes allowed characters (i.e. numbers) before the placeholder', () => {
    const input = getInput({
      format: '+1 (###) ###-##-##',
      strip: /^(\+1)|[^\d]/g,
      allow: /\d/g,
    });

    userEvent.type(input, '4812');
    // Can't set selection range to 0, 0 because of some weird bug where setting it to 0, 0 does nothing in jest
    // Checked it manually in a browser, and it works even when the cursor is moved to the start of a selection
    input.setSelectionRange(2, 2);
    userEvent.type(input, '950123');

    expect(input.value).toBe('+1 (950) 123-48-12');
  });
});
