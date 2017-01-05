module CreditCard.Config
    exposing
        ( Config
        , FormConfig
        , Form
        , defaultConfig
        , defaultFormConfig
        , defaultClasses
        , defaultLabels
        , defaultPlaceholders
        )

{-|
# Configuration
@docs Config, FormConfig, Form

# Default Configuration
@docs defaultConfig, defaultFormConfig, defaultClasses, defaultLabels, defaultPlaceholders
-}

import CreditCard.Internal exposing (State, CardData)


{-| Configuration for card view
* `blankChar` : character used to render empty text in the card.
* `blankName` : text used as placeholder for when the name is empty.
-}
type alias Config config =
    { config
        | blankChar : Char
        , blankName : String
    }


{-| Configuration for form view.

This includes all configuration from `Config` with addition of:
* `onChange` : `Msg` function for updating `CardData`
* `showLabel` : hide/show the label of each form field.
* `classes` : classes of each form field's container, stored in a `Form` record.
* `labels` : text of each form field's label, stored in a `Form` record.
* `placeholders` : the placeholder text of form field, stored in a `Form` record.
-}
type alias FormConfig model msg =
    { blankChar : Char
    , blankName : String
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
    , ccv : String
    }


{-| Default configuration for card view
* `blankChar = '•'`
* `blankName = 'YOUR NAME'`
-}
defaultConfig : Config {}
defaultConfig =
    { blankChar = '•'
    , blankName = "YOUR NAME"
    }


{-| Default configuration for form view
Requires a `Msg` function to update the `CardData`
* `showLabel = True`
* `classes =` See `defaultClasses`
* `labels =` See `defaultLabels`
* `placeholders =` See `defaultPlaceholders`
-}
defaultFormConfig : (CardData model -> msg) -> FormConfig model msg
defaultFormConfig onChange =
    { blankChar = defaultConfig.blankChar
    , blankName = defaultConfig.blankName
    , onChange = onChange
    , showLabel = True
    , classes = defaultClasses
    , labels = defaultLabels
    , placeholders = defaultPlaceholders
    }


{-| Default classes name for form view
* `number = "Number"`
* `name = "Name"`
* `month = "Month"`
* `year = "Year"`
* `ccv = "CCV"`
-}
defaultClasses : Form
defaultClasses =
    { number = "Number"
    , name = "Name"
    , month = "Month"
    , year = "Year"
    , ccv = "CCV"
    }


{-| Default label for form view
* `number = "Number"`
* `name = "Full Name"`
* `month = "Month"`
* `year = "Year"`
* `ccv = "CCV"`
-}
defaultLabels : Form
defaultLabels =
    { number = "Number"
    , name = "Full Name"
    , month = "Month"
    , year = "Year"
    , ccv = "CCV"
    }


{-| Default placeholder text for form view
* `number = "Credit Card Number"`
* `name = "First Last"`
* `month = "MM"`
* `year = "YYYY"`
* `ccv = "CCV"`
-}
defaultPlaceholders : Form
defaultPlaceholders =
    { number = "Credit Card Number"
    , name = "First Last"
    , month = "MM"
    , year = "YYYY"
    , ccv = "CCV"
    }
