module CreditCard.Internal
    exposing
        ( InternalState
        , Field
        , Styles
        , CardStyle
        , CardInfo
        , NumberFormat
        , CardType(..)
        , CCVPosition(..)
        , init
        , defaultConfig
        )

{-| Model types and all related helper functions

# Model
@docs Model, Field, Styles,  CardInfo,  CardType

# Styling and Formatting
@docs Config, CardStyle, CCVPosition, NumberFormat

# Helper Functions
@docs init, defaultConfig
-}

import Svg exposing (Svg, Attribute)
import CreditCard.Config exposing (Config)


type InternalState
    = InternalState


{-| A type representing the Credit Card model.
-}
type alias StateValue msg =
    { cardInfo : Maybe (CardInfo msg)
    , flipped : Maybe Bool
    }


{-| A type representing an input field with specific type.
-}
type alias Field a =
    { id : String
    , label : Maybe String
    , value : Maybe a
    , hasFocus : Bool
    }


{-| A type representing the form style.
-}
type alias Styles msg =
    { cardStyle : CardStyle msg
    }


{-| A type representing the card style.
-}
type alias CardStyle msg =
    { background : { attributes : List (Attribute msg), svg : List (Svg msg), defs : List (Svg msg) }
    , textColor : String
    , lightTextColor : String
    , darkTextColor : String
    }


{-| A union type representing the credit card type.
-}
type CardType
    = Unknown
    | Visa
    | Mastercard
    | Amex
    | Discover
    | DinersClubCarteBlanche
    | DinersClubInternational
    | JCB
    | Laser
    | Maestro
    | VisaElectron


{-| A type representing the format of the number by specifying the size of each group.
e.g: `[4, 4, 5]` will format the number to be XXXX XXXX XXXXX
-}
type alias NumberFormat =
    List Int


{-| A union type representing the position of the CCV
-}
type CCVPosition
    = Front
    | Back


{-| A type representing the card information.
-}
type alias CardInfo msg =
    { cardType : CardType
    , validLength : List Int
    , numberFormat : NumberFormat
    , cardStyle : CardStyle msg
    , ccvPosition : CCVPosition
    }


{-| Initalize the model by passing in the `Config`
-}
init : Model msg
init =
    { number = { id = "", label = Just "Card Number", value = Nothing, hasFocus = False }
    , name = { id = "", label = Just "Full Name", value = Nothing, hasFocus = False }
    , expirationMonth = { id = "", label = Just "MM", value = Nothing, hasFocus = False }
    , expirationYear = { id = "", label = Just "YYYY", value = Nothing, hasFocus = False }
    , ccv = { id = "", label = Just "CCV", value = Nothing, hasFocus = False }
    , cardInfo = Nothing
    , flipped = Nothing
    }


{-| The default `Config` value
-}
defaultConfig : Config
defaultConfig =
    { blankChar = '•'
    }
