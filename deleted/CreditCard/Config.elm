module CreditCard.Config
    exposing
        ( Config
        , FormConfig
        )

{-| Configuration for Credit Card and Credit Card Form view
@docs Config, FormConfig

-}


{-| A type representing the configurable options for the card view.
-}
type alias Config =
    { blankChar : Char
    }


{-| A type representing the configurable options for the form view.
-}
type alias FormConfig =
    { showLabel : Bool
    }
