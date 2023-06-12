# driver

[![Build](https://github.com/switz/driver/actions/workflows/release.yaml/badge.svg)](https://github.com/switz/driver/actions/workflows/release.yaml) ![npm (scoped)](https://img.shields.io/npm/v/@switz/driver?color=blue) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@switz/driver?color=green)

Driver is a framework agnostic, zero dependency, tiny utility for organizing boolean logic. Let's look at some very basic sample code:

```javascript
const CheckoutButton = ({ cartItems, }) => {
  const shoppingCart = driver({
    states: {
      isEmpty: cartItems.length === 0,
      canCheckout: cartItems.length > 0,
    },
    derived: {
      isDisabled: ['isError'],
    },
  });

  return (
      <Button icon="checkout" disabled={shoppingCart.isDisabled} onClick={onClick}>
        Checkout
      </Button>
  );
}
```

And here's the state chart of what we've designed:

| States  | isDisabled |
| ------------- | ------------- |
| isEmpty | true |
| canCheckout | false |

Here we have two possible states: `isEmpty` or `canCheckout` and one derived value from each state: isDisabled. Now you're probably thinking – this is overkill! We only have two states, just do this:

```javascript
const CheckoutButton = ({ cartItems }) => {
  const isEmpty = cartItems.length === 0;

  return (
      <Button icon="checkout" disabled={isEmpty} onClick={onClick}>
        Checkout
      </Button>
  );
}
```

And in many ways you'd be right. But as your logic and code grows, you'll end up going from simple flags to a mishmash of logic. What happens when we add a third, or fourth state, and more derived values? You can quickly go from 2 possible state values to perhaps 12, 24, more, and more.

Here's a more complex example with 4 states and 3 derived values. Can you see how giving our state some rigidity could reduce logic bugs?

```javascript
const CheckoutButton = ({ cartItems, isLoading }) => {
  const cartValidation = validation(cartItems);
  const shoppingCart = driver({
    states: {
      isLoading,
      isCartEmpty: cartItems.length === 0,
      isCartInvalid: !!cartValidation.isError,
      isCartValid: true, // fallback/default
    },
    derived: {
      popoverText: {
        //isLoading: undefined,
        isCartEmpty: 'Your shopping cart is empty, add items to checkout',
        isCartInvalid: 'Your shopping cart has errors: ' + cartValidation.errorText,
      },
      buttonVariant: {
        isLoading: 'info',
        isCartEmpty: 'info',
        isCartInvalid: 'error',
        isCartValid: 'primary',
      },
      onClick: {
        // unspecified keys will return undefined when their state is active
        // which is what we want anyway for an onClick handler
        // we can re-use this key for the disabled prop too, since if there is no onClick handler,
        // the button is disabled

        // isCartEmpty: undefined,
        // isCartInvalid: undefined,
        isCartValid: checkout,
      }
    },
  });

  return (
    <Popover content={shoppingCart.popoverText} disabled={!shoppingCart.popoverText}>
      <Button icon="checkout" intent={shoppingCart.buttonVariant} disabled={!shoppingCart.onClick} onClick={shoppingCart.onClick}>
        Checkout
      </Button>
    </Popover>
  );
}
```

What does this state tree look like in a rigid table?

| States  | popoverText | buttonVariant | onClick |
| ------------- | ------------- | ------------- | ------------- |
| isLoading |   | info |  |
| isCartEmpty | "Your shopping cart is empty..." | info |  |
| isCartInvalid | "Your shopping cart has errors..." | error |  |
| isCartValid |  | primary | () => checkout |

The values on the left are the potential active states, and will map each key to the value in the matrix. Putting it in table form displays the rigidity of the logic that we're designing, rather than intermixing let/const/if/ternary logic.

### Background

After working with state machines, I realized I was tracking UI states via a plethora of boolean values, often intermixing const/let declarations with inline ternary logic. This is inevitable when working with a library like react.

Even though state machines are very useful, often my UI state is derived from boolean logic (via API data or useStates) and not from a state machine I want to build and manually transition myself. So let's take out the machine part and just reflect common stateful values.

For example, a particular button component may have several states, but will always need to know:

1. is the button disabled or does it have an onClick handler?
2. what is the button text, if it changes?
3. what is the button's style/variant/intent, depending on if its valid or not?

and other common values like

3. what is the popover/warning text if the button is disabled?

By segmenting our UIs into explicit states, we can design and extend our UIs in a more pragmatic and extensible way. Logic is easier to reason about, organize, and test – and we can extend that logic without manipulating inline ternary expressions or fighting long lists of complex boolean logic.

Maybe you have written (or had to modify), code that looks like this:

```javascript
const CheckoutButton = ({ cartItems }) => {
  const cartValidation = validation(cartItems);
  let popoverText = 'Your shopping cart is empty, add items to checkout';
  let buttonVariant = 'info';
  let isDisabled = true;

  if (cartValidation.isError) {
    popoverText = 'Your shopping cart has errors: ' + cartValidation.errorText;
    buttonVariant = 'error';
  }
  else if (cartItems.length > 0) {
    popoverText = null;
    isDisabled = false;
    buttonVariant = 'info';
  }

  return (
    <Popover content={popoverText} disabled={!popoverText}>
      <Button icon="checkout" intent={buttonVariant} disabled={isDisabled} onClick={checkout}>
        Checkout
      </Button>
    </Popover>
  );
}
```

Touching this code is a mess, keeping track of the state tree is hard, and interleaving state values, boolean logic, and so on is cumbersome. You could write this a million different ways.

Not to mention the implicit initial state that the default values imply the cart is empty. This state is essentially hidden to anyone reading the code. You could write this better – but you could also write it even worse. By using driver, your states are much more clearly delineated.


## Installation

```bash
$ yarn add @switz/driver
# or
$ npm i @switz/driver
# or
$ pnpm i @switz/driver
```

## Simple example:

Every _driver_ contains a single active state. The first key in `states` to be true is the active state. Think of these as effectively if/else if statements.

This library has no dependencies and is not React specific, but it only derives values from what you pass into it and does not watch/observe for state changes which fits well into the React paradigm. Here is an example in a React component:

```javascript
const DownloadButton = ({ match }) => {
  const demoButton = driver({
    states: {
      isNotRecorded: !!match.config.dontRecord,
      isUploading: !match.demo_uploaded,
      isUploaded: !!match.demo_uploaded,
    },
    derived: {
      isDisabled: ['isNotRecorded', 'isUploading'],
      // could also write this as:
      // isDisabled: (states) => states.isNotRecorded || states.isUploading,
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  return (
    <Button icon="download" disabled={!!demoButton.isDisabled}>
      {demoButton.text}
    </Button>
  );
}
```

The derived data is pulled from the state keys. You can pass a function (and return any value), an array to mark boolean derived flags, or you can pass an object with the state keys, and whatever the current state key is will return that value.

`isDisabled` is true if any of the specified state keys are active, whereas `text` returns whichever string corresponds directly to the currently active state value.

Now instead of tossing ternary statements and if else and tracking messy declarations, all of your ui state can be derived through a simpler and concise state-machine inspired pattern.

The goal here is not to have _zero_ logic inside of your actual view, but to make it easier and more maintainable to design and build your view logic in some more complex situations.

## Docs

The `driver` function takes an object parameter with two keys: `states` and `derived`.

`states` is an object whose keys are the potential state values. Passing boolean values into these keys dictates which state key is currently active. The first key with a truthy value is the active state.

`derived` is an object whose keys derive their values from what the current state key is. There are three interface for the `derived` object.

### States

```javascript
// states
{
  isNotRecorded: !!match.config.dontRecord,
  isUploading: !match.demo_uploaded,
  isUploaded: !!match.demo_uploaded,
},
```

### Derived

#### Function

You can return any value you'd like out of the function using the state keys

```javascript
// derived
{
  isDisabled: (states) => states.isNotRecorded || states.isUploading,
}
```

or you can access generated enums for more flexible logic

```javascript
// derived
{
  isDisabled: (state, stateEnums, activeEnum) => (activeEnum ?? 0) <= stateEnums.isUploading,
}
```

This declares that any state key _above_ isUploading means the button is disabled (in this case, `isNotRecorded` and `isUploading`).

#### Array

By using an array, you can specify a boolean if any item in the array matches the current state:

```javascript
// derived
{
  isDisabled: ['isNotRecorded', 'isUploading'],
}
```

This is the same as writing: `(states) => states.isNotRecorded || states.isUploading` in the function API above.

#### Object lookup

If you want to have a unique value per active state, an object map is the easiest way to declare as such. Each key maps to what the value is for the active state. For Example:

```javascript
// derived
{
  text: {
    isNotRecorded: 'Demo Disabled',
    isUploading: 'Demo Uploading...',
    isUploaded: 'Download Demo',
  },
}
```

If the current state is `isNotRecorded` then the `text` key will return `'Demo Disabled'`.

`isUploading` will return `'Demo Uploading...'`, and `isUploaded` will return `'Download Demo'`.

## This is naive

I cobbled this together in a few hours or so, it's not fully tested or complete. I do think I'll end up using it quite a bit, but I'll likely rewrite the API and rename it and change a lot. Please contribute if you have ideas, I'm open to everything.

## Typescript

This library is fully typed end-to-end. That said, this is the first time I've typed a library of this kind and I'm sure it could be improved. If you run into an issue, please raise it or submit a PR.

## Local Development

To install dependencies:

```bash
bun install
```

To test:

_waiting on bun to upgrade to TS 5 syntax support_

```bash
bun test
```
