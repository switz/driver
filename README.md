<div align="center">
<h1>🏁 driver</h1>

[![Build](https://github.com/switz/driver/actions/workflows/release.yaml/badge.svg)](https://github.com/switz/driver/actions/workflows/release.yaml) ![npm (scoped)](https://img.shields.io/npm/v/@switz/driver?color=blue) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@switz/driver?color=green)
</div>

driver is a tiny typescript utility for organizing external data into finite states and deriving common values.

Jump to [sample code](https://github.com/switz/driver#-sample-code) or the [docs](https://github.com/switz/driver#-docs).

<h2>✨ Features</h2>

- Tiny with zero dependencies (<500B _gzip_)
- Framework agnostic (works with react, svelte, vue, node, deno, bun, cloudflare workers, etc.)
- Fully typed
- Declarative API

<h2>📦 Installation</h2>

```bash
$ npm i @switz/driver
```

<h2>🍬 Sample Code</h2>

```javascript
const CheckoutButton = ({ cartItems, isLoading, checkout }) => {
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
        // unspecified states (isLoading, isCartValid here) default to undefined
        isCartEmpty: 'Your shopping cart is empty, add items to checkout',
        isCartInvalid: 'Your shopping cart has errors: ' + cartValidation.errorText,
      },
      buttonVariant: {
        isLoading: 'info',
        isCartEmpty: 'info',
        isCartInvalid: 'error',
        isCartValid: 'primary',
      },
      // onClick will be undefined except `ifCartValid` is true
      // <button onClick handlers accept undefined so that's okay!
      onClick: {
        isCartValid: checkout,
      }
    },
  });

  return (
    <Popover content={shoppingCart.popoverText} disabled={!shoppingCart.popoverText}>
      <Button
        icon="checkout"
        intent={shoppingCart.buttonVariant}
        disabled={!shoppingCart.onClick}
        onClick={shoppingCart.onClick}
      >
        Checkout
      </Button>
    </Popover>
  );
}
```

## 👩‍🏭 Basic Introduction

Each driver works by defining finite states. Only **one** state can be active at any given time. The first state to resolve to `true` is active.

Let's look at some examples. I'm going to use React, but you don't have to.

We define the possible states in the `states` object. The first state value to be true is the *active state* (these are akin to if/else statements).

```javascript
import driver from '@switz/driver';

const CheckoutButton = ({ cartItems }) => {
  const button = driver({
    states: {
      isEmpty: cartItems.length === 0,
      canCheckout: cartItems.length > 0,
    },
    derived: {
      // if the active state matches any strings in the array, `isDisabled` returns true
      isDisabled: ['isEmpty'],
    },
  });

  return (
    <Button icon="checkout" disabled={button.isDisabled} onClick={onClick}>
      Checkout
    </Button>
  );
}
```

Since driver gives us some guardrails to our stateful logic, they can be reflected as state tables:

| States  | isDisabled |
| ------------- | ------------- |
| isEmpty | true |
| canCheckout | false |

Here we have two possible states: `isEmpty` or `canCheckout` and one derived value from each state: isDisabled.

Now you're probably thinking – this is over-engineering! We only have two states, why not just do this:

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

And in many ways you'd be right. But as your logic and code grows, you'll very quickly end up going from a single boolean flag to a mishmash of many. What happens when we add a third, or fourth state, and more derived values? What happens when we nest states? You can quickly go from 2 possible states to perhaps 12, 24, or many many more even in the simplest of components.

Here's a more complex example with 4 states and 3 derived values. Can you see how giving our state some rigidity could reduce logic bugs?

```javascript
const CheckoutButton = ({ cartItems, isLoading, checkout }) => {
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
        // unspecified states (isLoading, isCartValid here) default to undefined
        isCartEmpty: 'Your shopping cart is empty, add items to checkout',
        isCartInvalid: 'Your shopping cart has errors: ' + cartValidation.errorText,
      },
      buttonVariant: {
        isLoading: 'info',
        isCartEmpty: 'info',
        isCartInvalid: 'error',
        isCartValid: 'primary',
      },
      // onClick will be undefined except `ifCartValid` is true
      // <button onClick handlers accept undefined so that's okay!
      onClick: {
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

What does this state table look like?

| States  | popoverText | buttonVariant | onClick |
| ------------- | ------------- | ------------- | ------------- |
| isLoading |   | info |  |
| isCartEmpty | "Your shopping cart is empty..." | info |  |
| isCartInvalid | "Your shopping cart has errors..." | error |  |
| isCartValid |  | primary | () => checkout |

Putting it in table form displays the rigidity of the logic that we're designing.

## 🖼️ Background

After working with state machines, I realized the benefits of giving your state rigidity. I noticed that I was tracking UI states via a plethora of boolean values, often intermixing const/let declarations with inline ternary logic. This is often inevitable when working with stateful UI libraries like react.

Even though state machines are very useful, I also realized that my UI state is largely derived from boolean logic (via API data or React state) and not from a state machine I want to build and manually transition myself. So let's take out the machine part and just reflect common stateful values.

For example, a particular button component may have several states, but will always need to know:

1. is the button disabled/does it have an onClick handler?
2. what is the button text?
3. what is the button's style/variant/intent, depending on if its valid or not?

and other common values like

4. what is the popover/warning text if the button is disabled?

By segmenting our UIs into explicit states, we can design and extend our UIs in a more pragmatic and extensible way. Logic is easier to reason about, organize, and test – and we can extend that logic without manipulating inline ternary expressions or fighting long lists of complex boolean logic.

Maybe you have written (or had to modify), code that looks like this:

```javascript
const CheckoutButton = ({ cartItems, isLoading }) => {
  const cartValidation = validation(cartItems);

  let popoverText = 'Your shopping cart is empty, add items to checkout';
  let buttonVariant = 'info';
  let isDisabled = true;

  if (cartValidation.isError) {
    popoverText = 'Your shopping cart has errors: ' + cartValidation.errorText;
    buttonVariant = 'error';
  }
  else if (cartValidation.hasItems) {
    popoverText = null;
    isDisabled = false;
    buttonVariant = 'primary';
  }

  return (
    <Popover content={popoverText} disabled={!popoverText}>
      <Button icon="checkout" intent={buttonVariant} disabled={isLoading || isDisabled} onClick={checkout}>
        Checkout
      </Button>
    </Popover>
  );
}
```

Touching this code is a mess, keeping track of the state tree is hard, and interleaving state values, boolean logic, and so on is cumbersome. You could write this a million different ways.

Not to mention the implicit initial state that the default values imply the cart is empty. This state is essentially hidden to anyone reading the code. You could write this better – but you could also write it even worse. By using driver, your states are much more clearly delineated.


## Other examples:

Every _driver_ contains a single active state. The first key in `states` to be true is the active state.

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

## 👾 Docs

The `driver` function takes an object parameter with two keys: `states` and `derived`.

```javascript
driver({
  states: {
    state1: false,
    state2: true,
  },
  derived: {
    text: {
      state1: 'State 1!',
      state2: 'State 2!',
    }
  }
})
```

`states` is an object whose keys are the potential state values. Passing dynamic boolean values into these keys dictates which state key is currently active. The first key with a truthy value is the active state.

`derived` is an object whose keys derive their values from what the current state key is. There are three interfaces for the `derived` object.

### States

```javascript
driver({
  states: {
    isNotRecorded: match.config.dontRecord,
    isUploading: !match.demo_uploaded,
    isUploaded: match.demo_uploaded,
  },
});
```

### Derived

#### Function

You can return any value you'd like out of the function using the state keys

```diff
driver({
  states: {
    isNotRecorded: match.config.dontRecord,
    isUploading: !match.demo_uploaded,
    isUploaded: match.demo_uploaded,
  },
+  derived: {
+    isDisabled: (states) => states.isNotRecorded || states.isUploading,
+  }
})
```

or you can access generated enums for more flexible logic


```diff
driver({
  states: {
    isNotRecorded: match.config.dontRecord,
    isUploading: !match.demo_uploaded,
    isUploaded: match.demo_uploaded,
  },
  derived: {
+   isDisabled: (_, stateEnums, activeEnum) => (activeEnum ?? 0) <= stateEnums.isUploading,
  }
})
```

This declares that any state key _above_ isUploaded means the button is disabled (in this case, `isNotRecorded` and `isUploading`). This is useful for when you have delinated states and you want to more dynamically define where those lines are.

#### Array

By using an array, you can specify a boolean if any item in the array matches the current state:


```diff
driver({
  states: {
    isNotRecorded: match.config.dontRecord,
    isUploading: !match.demo_uploaded,
    isUploaded: match.demo_uploaded,
  },
  derived: {
+   isDisabled: ['isNotRecorded', 'isUploading'],
  }
})
```

This returns true if the active state is: `isNotRecorded` or `isUploading`.

This is the same as writing: `(states) => states.isNotRecorded || states.isUploading` in the function API above.

#### Object Lookup

If you want to have an independent value per active state, an object map is the easiest way. Each state key returns its value if it is the active state. For Example:


```diff
driver({
  states: {
    isNotRecorded: match.config.dontRecord,
    isUploading: !match.demo_uploaded,
    isUploaded: match.demo_uploaded,
  },
  derived: {
+   text: {
+     isNotRecorded: 'Demo Disabled',
+     isUploading: 'Demo Uploading...',
+     isUploaded: 'Download Demo',
+   },
  }
})
```

If the current state is `isNotRecorded` then the `text` key will return `'Demo Disabled'`.

`isUploading` will return `'Demo Uploading...'`, and `isUploaded` will return `'Download Demo'`.


### Svelte Example

This is a button with unique text that stops working at 10 clicks. Just prepend the driver call with `$: ` to mark it as reactive.

```javascript
<script>
    import driver from "@switz/driver";
    let count = 0;

    function handleClick() {
      count += 1;
    }

    // use $ to mark our driver as reactive
    $: buttonInfo = driver({
      states: {
        IS_ZERO: count === 0,
        IS_TEN: count >= 10,
        IS_MORE: count >= 0
      },
      derived: {
        text: {
          IS_ZERO: "Click me to get started",
          IS_MORE: `Clicked ${count} ${count === 1 ? "time" : "times"}`,
          IS_TEN: "DONE!"
        },
        isDisabled: ["IS_TEN"]
      }
    });
</script>

<button on:click={handleClick} disabled={buttonInfo.isDisabled}>
  {buttonInfo.text}
</button>
```

## Help and Support

Join the Discord for help: https://discord.gg/dAKQQEDg9W

## Warning: this is naive and changing

This is still pretty early, the API surface may change. Code you write with this pattern may end up being _less_ efficient than before, with the hope that it reduces your logic bugs. This code is not _lazy_, so you may end up evaluating far more than you need for a given component. In my experience, you should not reach for a `driver` _immediately_, but as you see it fitting in, use it where it is handy. The _leafier_ the component (meaning further down the tree, closer to the bottom), the more useful I've found it.

## Typescript

This library is fully typed end-to-end. That said, this is the first time I've typed a library of this kind and it could definitely be improved. If you run into an issue, please raise it or submit a PR.

## Local Development

To install dependencies:

```bash
bun install
```

To test:

```bash
npm run test # we test the typescript types on top of basic unit tests
```
