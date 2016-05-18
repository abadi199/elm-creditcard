module CardType exposing (CardType(..), detect)

{-| Helper for detecting type of card
@docs CardType, detect
-}

import Regex exposing (Regex, contains, regex)


{-| CardType
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


type alias CardInfo =
    { cardType : CardType
    , pattern : Regex
    , validLength : List Int
    }


{-| detect the type of card
-}
detect : String -> CardType
detect number =
    cards
        |> List.map (\card -> ( contains card.pattern number, card ))
        |> List.filter (\( match, card ) -> match)
        |> List.head
        |> Maybe.map (\( _, card ) -> card.cardType)
        |> Maybe.withDefault Unknown


cards : List CardInfo
cards =
    [ { cardType = Amex
      , pattern = regex "^3[47]"
      , validLength = [ 15 ]
      }
    , { cardType = DinersClubCarteBlanche
      , pattern = regex "^30[0-5]"
      , validLength = [ 14 ]
      }
    , { cardType = DinersClubInternational
      , pattern = regex "^36"
      , validLength = [ 14 ]
      }
    , { cardType = JCB
      , pattern = regex "^35(2[89]|[3-8][0-9])"
      , validLength = [ 16 ]
      }
    , { cardType = Laser
      , pattern = regex "^(6304|670[69]|6771)"
      , validLength = [ 16, 17, 18, 19 ]
      }
    , { cardType = VisaElectron
      , pattern = regex "^(4026|417500|4508|4844|491(3|7))"
      , validLength = [ 16 ]
      }
    , { cardType = Visa
      , pattern = regex "^4"
      , validLength = [ 16 ]
      }
    , { cardType = Mastercard
      , pattern = regex "^5[1-5]"
      , validLength = [ 16 ]
      }
    , { cardType = Maestro
      , pattern = regex "^(5018|5020|5038|6304|6759|676[1-3])"
      , validLength = [ 12, 13, 14, 15, 16, 17, 18, 19 ]
      }
    , { cardType = Discover
      , pattern = regex "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"
      , validLength = [ 16 ]
      }
    ]
