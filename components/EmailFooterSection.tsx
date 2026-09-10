import {
    Section,
    Text,
    Link,
    Row,
    Column,
    Img,
    Container,
} from "@react-email/components";
import * as React from "react";

interface EmailFooterSectionProps {
    siteUrl?: string;
    unsubscribeUrl?: string;
}

export const EmailFooterSection = ({
    siteUrl = "https://www.jbhifi.com.au",
    unsubscribeUrl = "https://www.jbhifi.com.au/pages/manage-preferences?utm_campaign=JBMARKETING_jb-au-20260827-thurs-deals-edm%20%2801M0Y7W58G8VVBQKN72CMYF207%29&utm_medium=email&utm_source=JB%20Marketing%20%2890%20Days%29&_kx=VPaIIin_FSKTmq9UDELXYNdPUKwlt2_Ez43_qrl0Zp_YK_24k75fdHghENok1_7p.LQzntR",
}: EmailFooterSectionProps) => {
    return (
        <Section
            style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "20px 15px 30px 15px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <Container style={{ maxWidth: "570px", margin: "0 auto" }}>
                {/* Terms & Conditions Paragraphs */}
                <Text
                    style={{
                        fontSize: "9px",
                        lineHeight: "12px",
                        color: "#ffffff",
                        margin: "0 0 10px 0",
                        fontWeight: "bold",
                    }}
                >
                    ^Discounts apply to previous ticketed/advertised price prior to the discount offer. As we negotiate, products will likely have been sold below
                    ticketed/advertised price prior to the discount offer. Prices may differ at airport stores. Offer valid until 11:59PM AEST 09/09/26 unless
                    otherwise specified.
                </Text>

                <Text
                    style={{
                        fontSize: "9px",
                        lineHeight: "12px",
                        color: "#ffffff",
                        margin: "0 0 10px 0",
                        fontWeight: "bold",
                    }}
                >
                    &amp;Offer only available for eligible port-in mobile services (being
                    an existing mobile service transferred from another provider,
                    excluding any service that has been active on a Telstra, JB Hi-Fi, The
                    Good Guys, or Boost plan at any time in the 30 days before the
                    transfer). The Google Pixel 11 Pro XL 256GB (referred to as the "JB
                    Hi-Fi Voucher" in the Telstra Terms and Conditions available at{" "}
                    <Link
                        href="https://www.telstra.com.au/content/dam/tcom/personal/consumer-advice/pdf/consumer/jb-hi-fi-standard-terms-upfront-mobile-service-terms.pdf?utm_campaign=JBMARKETING_jb-au-20260827-thurs-deals-edm%20%2801M0Y7W58G8VVBQKN72CMYF207%29&utm_medium=email&utm_source=JB%20Marketing%20%2890%20Days%29&_kx=VPaIIin_FSKTmq9UDELXYNdPUKwlt2_Ez43_qrl0Zp_YK_24k75fdHghENok1_7p.LQzntR"
                        target="_blank"
                        style={{
                            color: "#ffffff",
                            textDecoration: "underline",
                        }}
                    >
                        www.telstra.com.au/jbhifi-mobile-terms
                    </Link>
                    ) replaces the dollar value of the Voucher in the Critical
                    Information Summary and will be available to you instore after
                    connection approval by Telstra. This plan requires you to pay 24
                    monthly instalments. If you cancel or move to a lower cost/different
                    plan before you have paid 24 monthly instalments in full, then you
                    must pay a Voucher Repayment Fee to Telstra pro-rated against the
                    remaining instalments (or part instalments). This offer is not
                    available in conjunction with any other JB Hi-Fi mobile or broadband
                    offer or trade-in coupon offer and is limited to 1 connection per
                    customer.
                </Text>

                <Text
                    style={{
                        fontSize: "9px",
                        lineHeight: "12px",
                        color: "#ffffff",
                        margin: "0 0 10px 0",
                        fontWeight: "bold",
                    }}
                >
                    ‡Speeds may vary due to various factors such as location, hardware and
                    network congestion. If you exceed your data allowance, your speed will
                    be capped at 1.5Mbps. Speed is slowed further in busy periods. For full
                    Terms &amp; Conditions and Critical Information Summary visit{" "}
                    <Link
                        href="https://www.jbhifi.com.au/pages/help-and-support/gift-card-terms-and-conditions?utm_campaign=JBMARKETING_jb-au-20260827-thurs-deals-edm+%2801M0Y7W58G8VVBQKN72CMYF207%29&utm_medium=email&utm_source=JB+Marketing+%2890+Days%29&_kx=VPaIIin_FSKTmq9UDELXYNdPUKwlt2_Ez43_qrl0Zp_YK_24k75fdHghENok1_7p.LQzntR"
                        target="_blank"
                        style={{
                            color: "#ffffff",
                            textDecoration: "underline",
                        }}
                    >
                        www.jbhifi.com.au/mobile-plans
                    </Link>
                    . Available instore only.
                </Text>

                <Text
                    style={{
                        fontSize: "9px",
                        lineHeight: "12px",
                        color: "#ffffff",
                        margin: "0 0 10px 0",
                        fontWeight: "bold",
                    }}
                >
                    #The JB Hi-Fi Trade-in program is operated by Assurant Services
                    Australia Pty Limited ABN 18 612 622 367, Second Hand Dealer 2PS20872.
                    Participant must be AU resident aged 18+ with trade-in device purchased
                    in AU. Assurant is not required to make an offer on your device. The
                    JB Hi-Fi eGift Card given in exchange for a trade-in is subject to
                    Terms and Conditions at{" "}
                    <Link
                        href="https://www.jbhifi.com.au/pages/help-and-support/gift-card-terms-and-conditions?utm_campaign=JBMARKETING_jb-au-20260827-thurs-deals-edm+%2801M0Y7W58G8VVBQKN72CMYF207%29&utm_medium=email&utm_source=JB+Marketing+%2890+Days%29&_kx=VPaIIin_FSKTmq9UDELXYNdPUKwlt2_Ez43_qrl0Zp_YK_24k75fdHghENok1_7p.LQzntR"
                        target="_blank"
                        style={{
                            color: "#ffffff",
                            textDecoration: "underline",
                        }}
                    >
                        www.jbhifi.com.au/giftcardterms
                    </Link>
                    . Pre-authorization will be taken from participant's payment card.
                    If traded in device is not received within 7 days after your trade-in,
                    Assurant may debit the trade-in value from your payment card. Assurant
                    Terms and Conditions at{" "}
                    <Link
                        href="trk.jbhifi.com.au/l/01M100YE5R0G95X03XJ19JV9P2_32"
                        target="_blank"
                        style={{
                            color: "#ffffff",
                            textDecoration: "underline",
                        }}
                    >
                        jbhifi.com.au/assurant-terms
                    </Link>
                    .
                </Text>

                <Text
                    style={{
                        fontSize: "9px",
                        lineHeight: "12px",
                        color: "#ffffff",
                        margin: "0 0 20px 0",
                        fontWeight: "bold",
                    }}
                >
                    †Customers who complete a trade-in with a trade-in value of at least $1
                    will receive an email offer to select from available JB Hi-Fi
                    coupon(s) for a discount on the next purchase of specific product(s).
                    The selected coupon(s) will be sent via email and are redeemable
                    instore or online in a single transaction (excluding airport stores).
                    Coupon(s) cannot be used in conjunction with any other promotion or
                    offer, or JB Hi-Fi mobile or broadband plan. Balance is not
                    redeemable for cash. Coupon(s) apply to the current ticketed price of
                    relevant product(s). As prices change regularly and as we frequently
                    run sales and negotiate on price, some products are likely to have
                    been sold below the current price prior to this offer. Prices may
                    change after offer ends.
                </Text>

                {/* Social Media Links */}
                <Section style={{ textAlign: "center", margin: "20px 0 15px 0" }}>
                    <Row style={{ width: "120px", margin: "0 auto" }}>
                        <Column align="center" style={{ width: "40px" }}>
                            <Link href="https://facebook.com" target="_blank">
                                <Img
                                    src="https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/8f1dbdd29ac02596d7c46b4e7c9a4e37.png"
                                    alt="Facebook"
                                    width="20"
                                    height="20"
                                    style={{ display: "block" }}
                                />
                            </Link>
                        </Column>
                        <Column align="center" style={{ width: "40px" }}>
                            <Link href="https://x.com" target="_blank">
                                <Img
                                    src="https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/d3ef7f4cad77a4f0cc2875351ac96484.png"
                                    alt="X"
                                    width="20"
                                    height="20"
                                    style={{ display: "block" }}
                                />
                            </Link>
                        </Column>
                        <Column align="center" style={{ width: "40px" }}>
                            <Link href="https://youtube.com" target="_blank">
                                <Img
                                    src="https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/e507c8bcd53e2b5b04a5f52d27a0d0e7.png"
                                    alt="YouTube"
                                    width="20"
                                    height="20"
                                    style={{ display: "block" }}
                                />
                            </Link>
                        </Column>
                    </Row>
                </Section>

                {/* Unsubscribe & Legal Information */}
                <Text
                    style={{
                        fontSize: "9px",
                        lineHeight: "12px",
                        color: "#ffffff",
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    If you no longer want to receive JB HI-FI marketing communications{" "}
                    <Link
                        href={unsubscribeUrl}
                        target="_blank"
                        style={{ color: "#ffffff", textDecoration: "underline" }}
                    >
                        unsubscribe here
                    </Link>
                    . This email was sent by JB Hi-Fi Group Pty Ltd (ABN 27 093 114 286), PO
                    Box 5190, South Melbourne VIC 3205, Australia. All content is the
                    property of JB Hi-Fi or its content suppliers and is protected by
                    copyright laws.
                </Text>
            </Container>
        </Section>
    );
};

export default EmailFooterSection;