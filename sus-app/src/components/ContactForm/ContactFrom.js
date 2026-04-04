import React from "react";
import leaf from "../../assets/small_leaf.png"
import './ContactForm.css'

function ContactForm() {
    return (
        <>
            <div className="contact-us-bg">
                <div className="map">
                    {/* <h1>Goofle map</h1> */}
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.3927055732224!2d77.33582947510061!3d23.301506378979315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c664effffffff%3A0x38f47bb9fb0e9f!2sSagar%20Institute%20of%20Science%20%26%20Technology!5e0!3m2!1sen!2sin!4v1774335248110!5m2!1sen!2sin"
                        width="100%" height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>

                <div className="contact-from">
                    <form action="https://formspree.io/f/xwpevqyb" method="post">
                        <p><img src={leaf} alt="" srcset="" />Get In Touch</p>
                        <h2>Wrting us Something</h2>
                        <div className="input-text">
                            <input type="text" name="username" id="username" placeholder="Your Name" autoComplete="off" required />
                            <input type="text" name="subject" id="subject" placeholder="Subject" autoComplete="off" required />
                        </div>

                        <div className="input-text">
                            <input type="text" name="email" id="email" placeholder="Your Email" autoComplete="off" required />
                            <input type="number" name="phoneno" id="phoneno" placeholder="Phone No" autoComplete="off" required />
                        </div>

                        <textarea name="message" id="message" cols="30" rows="6" autoCapitalize="off" required placeholder="Message"></textarea>
                        <button type="submit" className="button">Send Message</button>
                    </form>
                </div>

            </div>
        </>
    )
}
export default ContactForm 