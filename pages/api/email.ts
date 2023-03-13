import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { summary } = req.body;

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
     let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // send mail with defined transport object
    const email = process.env.EMAIL_SUMMARY;
    const info = await transporter.sendMail({
      from: '"Daily Email Summary Bot" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "Your email summary", // Subject line
      text: `Hello this is an automated meeting summary from your video call: ${summary}`, // plain text body
      html: "<b>Autogenerated summary?</b>", // html body
    });

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({ previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the email summary.');
  }
}
