module CreditCard.Internal exposing
    ( CVVPosition(..)
    , CardData
    , CardInfo
    , CardStyle
    , CardType(..)
    , NumberFormat
    , State(..)
    , StateValue
    , getStateValue
    , initialState
    )

import Html exposing (Attribute)
import Svg exposing (Svg)


type State
    = InternalState StateValue


{-| A type representing the Credit Card model.
-}
type alias StateValue =
    { flipped : Maybe Bool
    }


initialState : State
initialState =
    InternalState { flipped = Nothing }


getStateValue : State -> StateValue
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


{-| A union type representing the position of the CVV
-}
type CVVPosition
    = Front
    | Back


type alias CardData model =
    { model
        | number : Maybe String
        , name : Maybe String
        , month : Maybe String
        , year : Maybe String
        , cvv : Maybe String
        , state : State
    }


{-| A type representing the card information.
-}
type alias CardInfo msg =
    { cardType : CardType
    , validLength : List Int
    , numberFormat : NumberFormat
    , cardStyle : CardStyle msg
    , cvvPosition : CVVPosition
    }
