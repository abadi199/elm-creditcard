module CardType exposing (CardType(..), detect)

{-| Helper for detecting type of card
@docs CardType, detect
-}


{-| CardType
-}
type CardType
    = Visa
    | Mastercard
    | Amex
    | Discovery
    | DinersClubCarteBlanche
    | DinersClubInternational
    | JCB
    | Laser
    | Maestro
    | VisaElectron


{-| detect the type of card
-}
detect : String -> CardType
detect number =
    Visa
