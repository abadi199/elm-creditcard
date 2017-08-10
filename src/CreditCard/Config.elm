module CreditCard.Config
    exposing
        ( Config
        , Form
        , FormConfig
        , defaultClasses
        , defaultConfig
        , defaultFormConfig
        , defaultLabels
        , defaultPlaceholders
        )

{-|


# Configuration

@docs Config, FormConfig, Form


# Default Configuration

@docs defaultConfig, defaultFormConfig, defaultClasses, defaultLabels, defaultPlaceholders

-}

import CreditCard.Internal exposing (CardData, State)


{-| Configuration for card view

  - `blankChar` : character used to render empty text in the card.
  - `blankName` : text used as placeholder for when the name is empty.

-}
type alias Config config =
    { config
        | blankChar : Char
        , blankName : String
        , class : String
    }


{-| Configuration for form view.

This includes all configuration from `Config` with addition of:

  - `onChange` : `Msg` function for updating `CardData`
  - `showLabel` : hide/show the label of each form field.
  - `classes` : classes of each form field's container, stored in a `Form` record.
  - `labels` : text of each form field's label, stored in a `Form` record.
  - `placeholders` : the placeholder text of form field, stored in a `Form` record.

-}
type alias FormConfig model msg =
    { blankChar : Char
    , blankName : String
    , class : String
    , onChange : CardData model -> msg
    , showLabel : Bool
    , classes : Form
    , labels : Form
    , placeholders : Form
    }


{-| For all form related configuration (e.g.: classes, labels, etc)
-}
type alias Form =
    { number : String
    , name : String
    , month : String
    , year : String
    , cvv : String
    }


{-| Default configuration for card view

  - `blankChar = '•'`
  - `blankName = 'YOUR NAME'`

-}
defaultConfig : Config {}
defaultConfig =
    { blankChar = '•'
    , blankName = "YOUR NAME"
    , class = "elm-card-svg"
    }


{-| Default configuration for form view
Requires a `Msg` function to update the `CardData`

  - `showLabel = True`
  - `classes =` See `defaultClasses`
  - `labels =` See `defaultLabels`
  - `placeholders =` See `defaultPlaceholders`

-}
defaultFormConfig : (CardData model -> msg) -> FormConfig model msg
defaultFormConfig onChange =
    { blankChar = defaultConfig.blankChar
    , blankName = defaultConfig.blankName
    , class = defaultConfig.class
    , onChange = onChange
    , showLabel = True
    , classes = defaultClasses
    , labels = defaultLabels
    , placeholders = defaultPlaceholders
    }


{-| Default classes name for form view

  - `number = "Number"`
  - `name = "Name"`
  - `month = "Month"`
  - `year = "Year"`
  - `cvv = "CVV"`

-}
defaultClasses : Form
defaultClasses =
    { number = "Number"
    , name = "Name"
    , month = "Month"
    , year = "Year"
    , cvv = "CVV"
    }


{-| Default label for form view

  - `number = "Number"`
  - `name = "Full Name"`
  - `month = "Month"`
  - `year = "Year"`
  - `cvv = "CVV"`

-}
defaultLabels : Form
defaultLabels =
    { number = "Number"
    , name = "Full Name"
    , month = "Month"
    , year = "Year"
    , cvv = "CVV"
    }


{-| Default placeholder text for form view

  - `number = "Credit Card Number"`
  - `name = "First Last"`
  - `month = "MM"`
  - `year = "YY"`
  - `cvv = "CVV"`

-}
defaultPlaceholders : Form
defaultPlaceholders =
    { number = "Credit Card Number"
    , name = "First Last"
    , month = "MM"
    , year = "YY"
    , cvv = "CVV"
    }
