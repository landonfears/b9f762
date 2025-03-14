# Journey Builder

This app will display a list of nodes representing forms, and enables configuring prefilled fields based on inherited forms or global data.

## Quickstart

> [!NOTE]
> Useful information that users should know, even when skimming content.

From the project root:

```
pnpm install
```

Then start the mock server:

```
pnpm run dev:server
```

Then start the app:

```
pnpm run dev
```

## Walkthrough

When starting the app, you should see all nodes and the edges they are connected to:

![image](https://mi44j8ce65.ufs.sh/f/GWgmUQMEuTbPyKT7iv6EDJLBPo14SMTwUehkIsZ86xnXmzuA)

Clicking on a node will display all the form fields, along with the current configuration:

![image](https://mi44j8ce65.ufs.sh/f/GWgmUQMEuTbPCSvaGcVep367FkOvlgodmNJSAK9DUfP84LZr)

The configuration defaults to the closest ancestor form that has the same field ID.

You can perform a few functions here:

1. Toggle prefill fields for the form: This will make the prefill for each form inactive or active if there's a current configuration.
2. Toggle individual field: Clicking on the eye icon will make that specific form field inactive or active if there's a current configuration.
3. Remove individual field prefill configuration: Clicking the "X" icon will remove the existing prefill configuration.
4. Add a new prefill configuration: When clicking on a field without a configuration and compatible fields, a popup will display prompting you to create a new prefill mapping.

![image](https://mi44j8ce65.ufs.sh/f/GWgmUQMEuTbP2H7zHVumMSoDXVgvH6bCEZtGLA8a3NU1cKzT)

You can search for a specific field name, or browse through the existing ancestor forms' compatible fields.

> [!NOTE]
> Compatible fields means that the field comes from a form that current form is inherited from, and it is of the same type.

There is also a "Global Data" list of fields that I have defined in the app that is separate from the list of nodes returned from the API.

When you select a field, the prefill configuration will be updated with the new mapping.

> [!NOTE]
> The prefill configuration for all nodes is saved in local storage, so any changes you make will persist when reloading the page.

## Tests

Tests can be run with:

```
pnpm run test
```

The tests cover:

- Fetching the graph JSON from the mock server
- Graph JSON processing the nodes and edges correctly
- Functionality for updating prefill data in our store
