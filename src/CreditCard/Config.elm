module CreditCard.Config
    exposing
        ( Config
        , FormConfig
        , Updaters
        , Form
        , defaultConfig
        , defaultFormConfig
        , defaultClasses
        , defaultLabels
        )

{-|
@docs Config, defaultConfig, FormConfig, Form, defaultFormConfig, defaultClasses, defaultLabels
-}


{-| Configuration for card view
-}
type alias Config config =
    { config
        | blankChar : Char
        , blankName : String
    }


{-| Updated functions for Form configuration
-}
type alias Updaters msg =
    { updateNumber : Maybe String -> msg
    , updateName : Maybe String -> msg
    , updateMonth : Maybe String -> msg
    , updateYear : Maybe String -> msg
    , updateCCV : Maybe String -> msg
    }


{-| Configuration for form view
-}
type alias FormConfig updaters =
    { updaters
        | showLabel : Bool
        , classes : Form
        , labels : Form
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
-}
defaultConfig : Config {}
defaultConfig =
    { blankChar = '•'
    , blankName = "YOUR NAME"
    }


{-| Default configuration for form view
-}
defaultFormConfig : Updaters msg -> Config (FormConfig (Updaters msg))
defaultFormConfig updaters =
    { blankChar = defaultConfig.blankChar
    , blankName = defaultConfig.blankName
    , updateNumber = updaters.updateNumber
    , updateName = updaters.updateName
    , updateMonth = updaters.updateMonth
    , updateYear = updaters.updateYear
    , updateCCV = updaters.updateCCV
    , showLabel = True
    , classes = defaultClasses
    , labels = defaultLabels
    }


{-| Default classes name for form view
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
-}
defaultLabels : Form
defaultLabels =
    { number = "Card Number"
    , name = "Full Name"
    , month = "Month"
    , year = "Year"
    , ccv = "Ccv"
    }
