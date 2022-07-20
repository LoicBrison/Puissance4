import { connect } from "http2";
import { v4 } from "uuid";
import { PlayerSession, QueryParams } from "../../types";
import { NameSelector } from "../component/NameSelector";
import { saveSession } from "../func/session";
import { updateQueryParams, urlSearchParams } from "../func/url";
import { useGame } from "../hooks/useGame";




type LoginScreenProps = {}

export function LoginScreen({}: LoginScreenProps){
    const {connect} = useGame()
    const handleLogin = async (name: string) => {
        const response: PlayerSession = await fetch('/api/players', {method: 'POST'}).then(r => r.json())
        const player = saveSession({
            ...response,
            name
        })
        const gameId = urlSearchParams().get(QueryParams.GAMEID) ?? v4()
        connect(player, gameId)
        updateQueryParams({[QueryParams.GAMEID]: gameId})
    }

    return <div>
        <NameSelector onSelect={handleLogin} />
        <img src="https://www.regles-de-jeux.com/wp-content/uploads/2014/03/puissance-4.jpg"/>
        <p>
            <img src="https://www.regles-de-jeux.com/wp-content/uploads/2014/03/puissance-4.jpg"/>
        </p>
    </div>
}
