module Model exposing (Model, Options, Field, Styles, CardStyle, CardInfo, CardType(..), init, unknownCard, unknownCardStyle)

{-| Model
-}

import Svg exposing (Svg, Attribute)
import Svg.Attributes exposing (fill, style)
import Helpers.Misc as Helper exposing (transitionAnimation)


type alias Model msg =
    { options : Options
    , number : Field Int
    , name : Field String
    , expirationMonth : Field Int
    , expirationYear : Field Int
    , ccv : Field Int
    , cardInfo : CardInfo msg
    , flipped : Maybe Bool
    }


type alias Options =
    { showLabel : Bool
    , maxNumberLength : Int
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


type alias CardInfo msg =
    { cardType : CardType
    , validLength : List Int
    , cardStyle : CardStyle msg
    }


unknownCardStyle : CardStyle msg
unknownCardStyle =
    { background = { attributes = [ transitionAnimation, fill "rgba(0, 0, 0, 0.4)" ], svg = [], defs = [] }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    }


unknownCard : CardInfo msg
unknownCard =
    { cardType = Unknown
    , validLength = [ 15 ]
    , cardStyle = unknownCardStyle
    }


{-| init
-}
init : Model msg
init =
    { options =
        { showLabel = False
        , maxNumberLength = 16
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
    , cardInfo = unknownCard
    , flipped = Nothing
    }
