module Helpers.CardType exposing (detect)

{-| Helper for detecting type of card
@docs CardType, detect
-}

import Regex exposing (Regex, contains, regex)
import Model exposing (CardStyle, Model, CardType(..), unknownCard, unknownCardStyle, CardInfo)
import Styles.Cards.Visa as VisaStyle
import Styles.Cards.Mastercard as MastercardStyle
import Styles.Cards.Amex as AmexStyle


{-| CardType
-}
type alias CardRegex msg =
    { pattern : Regex
    , cardInfo : CardInfo msg
    }


{-| detect the type of card
-}
detect : Model msg -> CardInfo msg
detect model =
    let
        number =
            model.number.value
                |> Maybe.map toString
                |> Maybe.withDefault ""
    in
        cards
            |> List.map (\card -> ( contains card.pattern number, card ))
            |> List.filter (\( match, card ) -> match)
            |> List.head
            |> Maybe.map (\( _, card ) -> card.cardInfo)
            |> Maybe.withDefault unknownCard


cards : List (CardRegex msg)
cards =
    [ { cardInfo =
            { cardType = Amex
            , validLength = [ 15 ]
            , cardStyle = AmexStyle.style
            }
      , pattern = regex "^3[47]"
      }
    , { cardInfo =
            { cardType = DinersClubCarteBlanche
            , validLength = [ 14 ]
            , cardStyle = unknownCardStyle
            }
      , pattern = regex "^30[0-5]"
      }
    , { cardInfo =
            { cardType = DinersClubInternational
            , validLength = [ 14 ]
            , cardStyle = unknownCardStyle
            }
      , pattern = regex "^36"
      }
    , { cardInfo =
            { cardType = JCB
            , validLength = [ 16 ]
            , cardStyle = unknownCardStyle
            }
      , pattern = regex "^35(2[89]|[3-8][0-9])"
      }
    , { cardInfo =
            { cardType = Laser
            , validLength = [ 16, 17, 18, 19 ]
            , cardStyle = unknownCardStyle
            }
      , pattern = regex "^(6304|670[69]|6771)"
      }
    , { cardInfo =
            { cardType = VisaElectron
            , validLength = [ 16 ]
            , cardStyle = VisaStyle.style
            }
      , pattern = regex "^(4026|417500|4508|4844|491(3|7))"
      }
    , { cardInfo =
            { cardType = Visa
            , validLength = [ 16 ]
            , cardStyle = VisaStyle.style
            }
      , pattern = regex "^4"
      }
    , { cardInfo =
            { cardType = Mastercard
            , validLength = [ 16 ]
            , cardStyle = MastercardStyle.style
            }
      , pattern = regex "^5[1-5]"
      }
    , { cardInfo =
            { cardType = Maestro
            , validLength = [ 12, 13, 14, 15, 16, 17, 18, 19 ]
            , cardStyle = unknownCardStyle
            }
      , pattern = regex "^(5018|5020|5038|6304|6759|676[1-3])"
      }
    , { cardInfo =
            { cardType = Discover
            , validLength = [ 16 ]
            , cardStyle = unknownCardStyle
            }
      , pattern = regex "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"
      }
    ]
