import DB from "lib/db";
import { getSession } from "next-auth/react";
import DailyCheck from 'modals/DailyChecks'

export default async function tag(req, res) {
    await DB();
    const session = await getSession({ req });

    // if (!session) return res.status(401).send("Login first!");

    console.log('session: ', session)

    const dailyCheckId = session?.dailyCheckId;
    if (req.method === 'POST') {

        const dailyCheckUpdated = await DailyCheck.findByIdAndUpdate(dailyCheckId, { logoutTime: new Date() })
        res.send("OK")
    } else {
        if (req?.query?.date) {
            const dailyChecks = await DailyCheck.find({ date: req?.query?.date }).populate('userId')
            res.send(dailyChecks)
        }
        else {
            const dailyCheckGotten = await DailyCheck.findById(dailyCheckId)
        }
    }
}