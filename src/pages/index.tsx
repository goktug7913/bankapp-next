// Homepage index page
import React from "react";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import commercialimg from '@/commercialbank.jpg'
import personalimg from '@/personalbank.jpg'
import wealthimg from '@/wealthmgmt.jpg'
import investmentimg from '@/investment.jpg'
import Image from "next/image";

export default function Home() {

    const [cardWidth, setCardWidth] = React.useState(268);

    return (
        <Box sx={{my:3}}>
            <Container>
                <Paper elevation={4} sx={{p:3}}>
                    <Stack spacing={4} sx={{}}>
                        <Typography variant="h4" component="h1">
                            World leading banking and investment services.
                        </Typography>
                        <Divider/>
                        <Typography variant="body1" component="h2">
                            We are a global leader in banking and financial services, with over 200 years of history in some of the world&apos;s most dynamic markets.
                        </Typography>

                        <Typography variant="body1" component="h2">
                            We provide a wide range of financial products and services to over 100 million customers through our four global businesses: Personal Banking, Commercial Banking, Wealth Management and Investment Banking.
                        </Typography>

                        <Typography variant="body1" component="h2">
                            We are committed to building a sustainable business over the long term and creating long-term value for our shareholders, our people, our customers and the communities in which we operate.
                        </Typography>
                    </Stack>
                </Paper>

                <Paper elevation={4} sx={{p:3, mt:3}}>
                    <Stack spacing={4} sx={{}}>
                        <Typography variant="h4" component="h1">
                            Our services
                        </Typography>
                        <Divider/>

                        <Grid2 container spacing={1} sm={6} xs={7} md={8} lg={12} sx={{alignSelf:"center"}}>
                            <Grid2>
                                <Card sx={{ maxWidth: cardWidth, height:"100%" }}>
                                    <CardActionArea>
                                        <CardMedia component="img" height="140" image={personalimg.src} alt=""/>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">Personal Banking</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Our personal banking services include current accounts, savings accounts, cryptocurrency wallets, mortgages, loans, credit cards and more.
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid2>

                            <Grid2>
                                <Card sx={{ maxWidth: cardWidth, height:"100%" }}>
                                    <CardActionArea>
                                        <CardMedia component="img" height="140" image={commercialimg.src} alt=""/>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">Commercial Banking</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Our commercial banking services include business accounts, business loans, business credit cards and more.
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid2>

                            <Grid2>
                                <Card sx={{ maxWidth: cardWidth, height:"100%" }}>
                                    <CardActionArea>
                                        <CardMedia component="img" height="140" image={wealthimg.src} alt=""/>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">Wealth Management</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Our wealth management services include investment accounts, investment loans, investment credit cards and more.
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid2>

                            <Grid2>
                                <Card sx={{ maxWidth: cardWidth, height:"100%" }}>
                                    <CardActionArea>
                                        <CardMedia component="img" height="140" image={investmentimg.src} alt=""/>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">Investment Banking</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Our investment banking services include investment accounts, investment loans, investment credit cards and more.
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid2>

                        </Grid2>

                    </Stack>
                </Paper>

                <Paper elevation={4} sx={{p:3, mt:3}}>
                    <Stack spacing={4} sx={{}}>
                        <Typography variant="h4" component="h1">
                            Our locations
                        </Typography>
                        <Divider/>
                        <Typography variant="body1" component="h2">
                            We have offices in over 50 countries around the world. Our main offices are located in:
                        </Typography>

                        <Grid2 container spacing={1} sx={{}}>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/ca.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/cz.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/cw.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/is.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/il.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/lu.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/us.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/gb.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/fr.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/de.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/it.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/es.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/br.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/tr.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/ru.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/in.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/au.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/za.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/kr.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/jp.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                            <Grid2><Image src={"https://flagicons.lipis.dev/flags/4x3/cn.svg"} alt={"flag"} height={30} width={36} /></Grid2>
                        </Grid2>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}