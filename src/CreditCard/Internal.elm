module CreditCard.Internal
    exposing
        ( InternalState
        , StateValue
        , initialState
        , getStateValue
        , CardStyle
        , CardType(..)
        , NumberFormat
        , CCVPosition(..)
        , CardData
        , CardInfo
        )

import Html exposing (Attribute)
import Svg exposing (Svg)


type InternalState msg
    = InternalState (StateValue msg)


{-| A type representing the Credit Card model.
-}
type alias StateValue msg =
    { cardInfo : Maybe (CardInfo msg)
    , flipped : Maybe Bool
    }


initialState : InternalState msg
initialState =
    InternalState { cardInfo = Nothing, flipped = Nothing }


getStateValue : InternalState msg -> StateValue msg
getStateValue state =
    case state of
        InternalState stateValue ->
            stateValue


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


type alias CardData msg model =
    { model
        | number : Maybe String
        , name : Maybe String
        , month : Maybe String
        , year : Maybe String
        , ccv : Maybe String
        , state : InternalState msg
    }


{-| A type representing the card information.
-}
type alias CardInfo msg =
    { cardType : CardType
    , validLength : List Int
    , numberFormat : NumberFormat
    , cardStyle : CardStyle msg
    , ccvPosition : CCVPosition
    }
