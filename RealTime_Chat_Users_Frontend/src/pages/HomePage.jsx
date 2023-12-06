import Chat from "../components/Chat"
import PrevisualizeChats from "../components/PrevisualizeChats"
import useChat from "../hooks/useChat"

const HomePage = () => {

    const { selectedChat } = useChat();

    if(Object.keys(selectedChat).length !== 0){
        return (
            <section className="flex flex-wrap h-full">
                <section className="lg:w-2/6 w-0 hidden lg:block h-full max-h-full">
                    <PrevisualizeChats/>
                </section>

                <section className="lg:w-4/6 w-full h-full max-h-full">
                    <Chat/>
                </section>
            </section>
        )
    }

    return (
        <section className="flex flex-wrap h-full">
            <section className="lg:w-2/6 w-full h-full max-h-full">
                <PrevisualizeChats/>
            </section>

            <section className="lg:w-4/6 w-0 hidden lg:block h-full max-h-full">
                <Chat/>
            </section>
        </section>
    )
}

export default HomePage