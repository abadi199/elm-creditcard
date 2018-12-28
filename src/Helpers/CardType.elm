module Helpers.CardType exposing
    ( detect
    , unknownCard
    )

{-| Helper for detecting type of card

@docs CardType, detect

-}

import CreditCard.Internal exposing (CVVPosition(..), CardData, CardInfo, CardStyle, CardType(..))
import Regex
import Styles.Cards.Amex as AmexStyle
import Styles.Cards.Diners as DinersStyle
import Styles.Cards.Discover as DiscoverStyle
import Styles.Cards.JCB as JCBStyle
import Styles.Cards.Mastercard as MastercardStyle
import Styles.Cards.Unknown as UnknownStyle
import Styles.Cards.Visa as VisaStyle


{-| CardType
-}
type alias CardRegex msg =
    { pattern : Regex.Regex
    , cardInfo : CardInfo msg
    }


{-| detect the type of card
-}
detect : CardData model -> CardInfo msg
detect model =
    let
        number =
            model.number
                |> Maybe.withDefault ""
    in
    cards
        |> List.map (\card -> ( Regex.contains card.pattern number, card ))
        |> List.filter (\( match, card ) -> match)
        |> List.head
        |> Maybe.map (\( _, card ) -> card.cardInfo)
        |> Maybe.withDefault unknownCard


cards : List (CardRegex msg)
cards =
    [ { cardInfo =
            { cardType = Amex
            , validLength = [ 15 ]
            , numberFormat = [ 4, 6, 5 ]
            , cardStyle = AmexStyle.style
            , cvvPosition = Front
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^3[47]"
      }
    , { cardInfo =
            { cardType = DinersClubCarteBlanche
            , validLength = [ 14 ]
            , numberFormat = [ 4, 6, 4 ]
            , cardStyle = DinersStyle.style
            , cvvPosition = Back
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^30[0-5]"
      }
    , { cardInfo =
            { cardType = DinersClubInternational
            , validLength = [ 14 ]
            , numberFormat = [ 4, 6, 4 ]
            , cardStyle = DinersStyle.style
            , cvvPosition = Back
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^36"
      }
    , { cardInfo =
            { cardType = JCB
            , validLength = [ 16 ]
            , numberFormat = [ 4, 4, 4, 4 ]
            , cardStyle = JCBStyle.style
            , cvvPosition = Back
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^35(2[89]|[3-8][0-9])"
      }
    , { cardInfo =
            { cardType = Laser
            , validLength = [ 16, 17, 18, 19 ]
            , numberFormat = [ 19 ]
            , cardStyle = VisaStyle.style
            , cvvPosition = Back
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^(6304|670[69]|6771)"
      }
    , { cardInfo =
            { cardType = VisaElectron
            , validLength = [ 16 ]
            , numberFormat = [ 4, 4, 4, 4 ]
            , cardStyle = VisaStyle.style
            , cvvPosition = Back
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^(4026|417500|4508|4844|491(3|7))"
      }
    , { cardInfo =
            { cardType = Visa
            , validLength = [ 16 ]
            , numberFormat = [ 4, 4, 4, 4 ]
            , cardStyle = VisaStyle.style
            , cvvPosition = Back
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^4"
      }
    , { cardInfo =
            { cardType = Mastercard
            , validLength = [ 16 ]
            , numberFormat = [ 4, 4, 4, 4 ]
            , cardStyle = MastercardStyle.style
            , cvvPosition = Back
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^5[1-5]"
      }
    , { cardInfo =
            { cardType = Maestro
            , validLength = [ 12, 13, 14, 15, 16, 17, 18, 19 ]
            , numberFormat = [ 4, 4, 4 ]
            , cardStyle = MastercardStyle.style
            , cvvPosition = Back
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^(5018|5020|5038|6304|6759|676[1-3])"
      }
    , { cardInfo =
            { cardType = Discover
            , validLength = [ 16 ]
            , numberFormat = [ 4, 4, 4, 4 ]
            , cardStyle = DiscoverStyle.style
            , cvvPosition = Back
            }
      , pattern = Maybe.withDefault Regex.never <| Regex.fromString "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"
      }
    ]


unknownCard : CardInfo msg
unknownCard =
    { cardType = Unknown
    , validLength = [ 16 ]
    , numberFormat = [ 4, 4, 4 ]
    , cardStyle = UnknownStyle.style
    , cvvPosition = Back
    }
