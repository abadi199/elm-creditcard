module Model
    exposing
        ( Model
        , Options
        , Field
        , Styles
        , CardStyle
        , CardInfo
        , NumberFormat
        , CardType(..)
        , CCVPosition(..)
        , init
        )

{-| Model
-}

import Svg exposing (Svg, Attribute)


type alias Model msg =
    { options : Options
    , number : Field Int
    , name : Field String
    , expirationMonth : Field Int
    , expirationYear : Field Int
    , ccv : Field Int
    , cardInfo : Maybe (CardInfo msg)
    , flipped : Maybe Bool
    }


type alias Options =
    { showLabel : Bool
    , blankChar : Char
    }


type alias Field a =
    { id : String
    , label : Maybe String
    , value : Maybe a
    , hasFocus : Bool
    }


type alias Styles msg =
    { cardStyle : CardStyle msg
    }


type alias CardStyle msg =
    { background : { attributes : List (Attribute msg), svg : List (Svg msg), defs : List (Svg msg) }
    , textColor : String
    , lightTextColor : String
    , darkTextColor : String
    }


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


type alias NumberFormat =
    List Int


type CCVPosition
    = Front
    | Back


type alias CardInfo msg =
    { cardType : CardType
    , validLength : List Int
    , numberFormat : NumberFormat
    , cardStyle : CardStyle msg
    , ccvPosition : CCVPosition
    }


{-| init
-}
init : Model msg
init =
    { options =
        { showLabel = False
        , blankChar =
            '•'
            -- '☺'
            -- '⋆'
        }
    , number = { id = "", label = Just "CC Number", value = Nothing, hasFocus = False }
    , name = { id = "", label = Just "Full Name", value = Nothing, hasFocus = False }
    , expirationMonth = { id = "", label = Just "MM", value = Nothing, hasFocus = False }
    , expirationYear = { id = "", label = Just "YYYY", value = Nothing, hasFocus = False }
    , ccv = { id = "", label = Just "CCV", value = Nothing, hasFocus = False }
    , cardInfo = Nothing
    , flipped = Nothing
    }
