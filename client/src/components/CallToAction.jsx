import { Button } from "flowbite-react"

const CallToAction = () => {
    return (
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center rounded-tl-3xl rounded-br-3xl items-center text-center">
            <div className="flex-1 justify-center flex flex-col">
                <h2 className="text-2xl">
                    Want Explore Git Hub Repo?
                </h2>
                <p className="my-2 text-gray-500">
                    Checkout those repo for other projects.
                </p>
                <Button gradientDuoTone='purpleToPink' className="rounded-tl-xl rounded-bl-none">
                    <a href="https://github.com/agash26" target="_blank" rel="noopener no referrer">
                        Agash&apos;s Repo
                    </a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <img src="https://github.blog/wp-content/uploads/2020/12/wallpaper_footer_4KUHD_16_9.png" className="h-40 w-auto rounded"/>
            </div>
        </div>

    )
}

export default CallToAction