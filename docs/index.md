If you've ever tried to make an input field that automatically formats as you type, you'll know it's actually a pain in the 🍑. That's right, a pain in the peach.

With this simple React component, you can create your own pattern using the `format` prop, start typing and witness the magic ✨

```HTML
<Input format="## - ## - ##">
```

![Formatted input](https://raw.githubusercontent.com/danielyefet/react-input-auto-format/main/images/input.gif)

## Quickstart

Install it:

```sh
npm install react-input-auto-format
```

Have fun:

```JSX
import Input from 'react-input-auto-format';

function Foo () {
    return <Input format="## / ##" />;
}
```

The `format` prop accepts any pattern - it's entirely up to you. Here's some inspiration:


| Style        | Pattern            | Result       |
| ------------ | ------------------ | ------------ |
| Expiry date  | \#\# / \#\#        | 12 / 34      |
| Sort code    | \#\# - \#\# - \#\# | 12 - 34 - 56 |
| Number plate | \#\#\#\# \#\#\#    | LM68 XKC     |

## Using custom regex

This component uses two regular expressions to handle the onChange event:
- one for stripping non-pattern characters (`strip`). Default value: `/[^\dA-z]/g`. Meaning: remove all characters that aren't numbers or letters. 
- one for checking whether a character is allowed for input (`allow`). Default value: `/[\dA-z]/`. Meaning: check whether a submitted character is a number or a letter.

In some cases, such as with a `format="+1 (###) ###-##-##"`, custom regex for characters to strip and characters to allow are required.
In this example, the following custom regex needs to be passed into the component:
- `strip={ /^(\+1)|[^\d]/g } `: strip +1 from the input value's beginning; also strip all non-number characters.
- `allow={ /\d/ }`: allow only numbers.

Example of an Input component with those properties:

```JSX
import Input from 'react-input-auto-format';

function Foo () {
    return <Input format="+1 (###) ###-##-##" strip={ /^(\+1)|[^\d]/g } allow={ /\d/ } />;
}
```
## Getting the raw value

To get the unformatted value, use the `onValueChange` prop.

```JSX
function Foo () {
    handleValueChange(value) {
        console.log(value); // 123456
    }

    return <Input
        format="## - ## - ##"
        onValueChange={handleValueChange}
    />;
}
```

## Everything else

All other props work the same as you would expect for a native input component. If you want the formatted value, use a standard `onChange` attribute and pull out `event.target.value`.
