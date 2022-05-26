# Dyanmic Json Schema API

This is an example project on how to use JSON schemas to dynamically control API validation.

## Entities

This API has 2 entity types.

| Name    | Description                                  |
| ------- | -------------------------------------------- |
| Schema  | A JSON schema for validating a setting value |
| Setting | A setting is just a key value pair           |

## Glossary

| Acronym | Definition                             |
| ------- | -------------------------------------- |
| ns      | Namespace - Used for grouping settings |

## Endpoints

Documentation for all endpoints

### /UpdateSchema

Updates a setting schema

#### Example

Creates a schema for the "theme" setting in the "foo" namespace

```json
// POST /UpdateSchema
{
  "ns": "foo",
  "setting": "theme",
  "schema": {
    "type": "string",
    "enum": ["dark mode 😎", "sunburn"]
  }
}
```

### /GetSchemas

Retrieves a list of schemas

#### Example

Gets the foo/theme and bar/theme schemas

```json
// POST /GetSchemas
[
  {
    "ns": "foo",
    "setting": "theme"
  },
  {
    "ns": "bar",
    "setting": "theme"
  }
]
```

### /UpdateSettings

Updates multiple setting values at once

#### Example

Updates the foo/theme and bar/theme setting values

```json
// POST /UpdateSettings
[
  {
    "ns": "foo",
    "setting": "theme",
    "value": "dark mode 😎"
  },
  {
    "ns": "bar",
    "setting": "theme",
    "value": "sunburn"
  }
]
```

### /GetSettings

Gets multiple setting values

#### Example

Gets the foo/theme and bar/theme setting values

```json
// POST /GetSettings
[
  {
    "ns": "foo",
    "setting": "theme"
  },
  {
    "ns": "bar",
    "setting": "theme"
  }
]
```
