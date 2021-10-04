# react-input-auto-format

A super simple input component that formats as you type.

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
    return <Input format="## - ## - ##" />;
}
```

The `format` prop accepts a pattern. The `#` character represents any number or letter, and you can put whatever else you like in there.

### Examples:

| Style        | Pattern            | Result       |
| ------------ | ------------------ | ------------ |
| Expiry date  | \#\# / \#\#        | 12 / 34      |
| Sort code    | \#\# - \#\# - \#\# | 12 - 34 - 56 |
| Number plate | \#\#\#\# \#\#\#    | LM68 XKC     |

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
