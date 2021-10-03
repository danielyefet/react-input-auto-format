# react-input-auto-format

A super simple input component that formats as you type.

```HTML
<Input format="## - ## - ##">
```

![Formatted input](/images/input.gif)

## Quick start

Install it...

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

The `format` prop accepts a pattern. The `#` character represents any number or letter. You can put whatever else you like in there.

### Examples:

| Pattern            | Result       |
| ------------------ | ------------ |
| \#\# / \#\#        | 12 / 34      |
| \#\# - \#\# - \#\# | 12 - 34 - 56 |
| \#\#\#\# \#\#\#    | LM68 XKC     |

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

All other props work the same as you would expect for a native input component. If you want the formatted value, use a normal `onChange` attribute and pull out `event.target.value`.
