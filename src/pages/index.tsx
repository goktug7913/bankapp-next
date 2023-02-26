// Homepage index page
import React from "react";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    Divider, Paper,
    Stack,
    Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import commercialimg from '@/commercialbank.jpg'
import personalimg from '@/personalbank.jpg'
import wealthimg from '@/wealthmgmt.jpg'
import investmentimg from '@/investment.jpg'

const CountryFlags = [
    { name: "United States", flag: "https://flagicons.lipis.dev/flags/4x3/us.svg" },
    { name: "United Kingdom", flag: "https://flagicons.lipis.dev/flags/4x3/gb.svg" },
    { name: "Germany", flag: "https://flagicons.lipis.dev/flags/4x3/de.svg" },
    { name: "France", flag: "https://flagicons.lipis.dev/flags/4x3/fr.svg" },
    { name: "Spain", flag: "https://flagicons.lipis.dev/flags/4x3/es.svg" },
    { name: "Italy", flag: "https://flagicons.lipis.dev/flags/4x3/it.svg" },
    { name: "Netherlands", flag: "https://flagicons.lipis.dev/flags/4x3/nl.svg" },
    { name: "Belgium", flag: "https://flagicons.lipis.dev/flags/4x3/be.svg" },
    { name: "Switzerland", flag: "https://flagicons.lipis.dev/flags/4x3/ch.svg" },
    { name: "Austria", flag: "https://flagicons.lipis.dev/flags/4x3/at.svg" },
    { name: "Sweden", flag: "https://flagicons.lipis.dev/flags/4x3/se.svg" },
    { name: "Norway", flag: "https://flagicons.lipis.dev/flags/4x3/no.svg" },
    { name: "Denmark", flag: "https://flagicons.lipis.dev/flags/4x3/dk.svg" },
    { name: "Finland", flag: "https://flagicons.lipis.dev/flags/4x3/fi.svg" },
    { name: "Poland", flag: "https://flagicons.lipis.dev/flags/4x3/pl.svg" },
    { name: "Czech Republic", flag: "https://flagicons.lipis.dev/flags/4x3/cz.svg" },
    { name: "Hungary", flag: "https://flagicons.lipis.dev/flags/4x3/hu.svg" },
    { name: "Portugal", flag: "https://flagicons.lipis.dev/flags/4x3/pt.svg" },
    { name: "Greece", flag: "https://flagicons.lipis.dev/flags/4x3/gr.svg" },
    { name: "Romania", flag: "https://flagicons.lipis.dev/flags/4x3/ro.svg" },
    { name: "Slovakia", flag: "https://flagicons.lipis.dev/flags/4x3/sk.svg" },
    { name: "Ireland", flag: "https://flagicons.lipis.dev/flags/4x3/ie.svg" },
    { name: "Bulgaria", flag: "https://flagicons.lipis.dev/flags/4x3/bg.svg" },
    { name: "Lithuania", flag: "https://flagicons.lipis.dev/flags/4x3/lt.svg" },
    { name: "Croatia", flag: "https://flagicons.lipis.dev/flags/4x3/hr.svg" },
    { name: "Latvia", flag: "https://flagicons.lipis.dev/flags/4x3/lv.svg" },
    { name: "Estonia", flag: "https://flagicons.lipis.dev/flags/4x3/ee.svg" },
    { name: "Slovenia", flag: "https://flagicons.lipis.dev/flags/4x3/si.svg" },
    { name: "Cyprus", flag: "https://flagicons.lipis.dev/flags/4x3/cy.svg" },
    { name: "Luxembourg", flag: "https://flagicons.lipis.dev/flags/4x3/lu.svg" },
    { name: "Malta", flag: "https://flagicons.lipis.dev/flags/4x3/mt.svg" },
    { name: "Bosnia and Herzegovina", flag: "https://flagicons.lipis.dev/flags/4x3/ba.svg" },
    { name: "Serbia", flag: "https://flagicons.lipis.dev/flags/4x3/rs.svg" },
    { name: "Albania", flag: "https://flagicons.lipis.dev/flags/4x3/al.svg" },
    { name: "North Macedonia", flag: "https://flagicons.lipis.dev/flags/4x3/mk.svg" },
    { name: "Montenegro", flag: "https://flagicons.lipis.dev/flags/4x3/me.svg" },
    { name: "Andorra", flag: "https://flagicons.lipis.dev/flags/4x3/ad.svg" },
    { name: "Liechtenstein", flag: "https://flagicons.lipis.dev/flags/4x3/li.svg" },
    { name: "Monaco", flag: "https://flagicons.lipis.dev/flags/4x3/mc.svg" },
    { name: "San Marino", flag: "https://flagicons.lipis.dev/flags/4x3/sm.svg" },
    { name: "Vatican City", flag: "https://flagicons.lipis.dev/flags/4x3/va.svg" },
    { name: "Turkey", flag: "https://flagicons.lipis.dev/flags/4x3/tr.svg" },
    { name: "Russia", flag: "https://flagicons.lipis.dev/flags/4x3/ru.svg" },
    { name: "Ukraine", flag: "https://flagicons.lipis.dev/flags/4x3/ua.svg" },
    { name: "Belarus", flag: "https://flagicons.lipis.dev/flags/4x3/by.svg" },
]

export default function Home() {

    const [cardWidth, setCardWidth] = React.useState(300);

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

                        <Grid2 container spacing={1} sx={{alignSelf:"center"}}>
                            <Grid2 sm={6} xs={12} md={4} lg={3}>
                                <Card sx={{height:"100%" }}>
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

                            <Grid2 sm={6} xs={12} md={4} lg={3}>
                                <Card sx={{ height:"100%" }}>
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

                            <Grid2 sm={6} xs={12} md={4} lg={3}>
                                <Card sx={{ height:"100%" }}>
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

                            <Grid2 sm={6} xs={12} md={4} lg={3}>
                                <Card sx={{ height:"100%" }}>
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

                        <Box>
                            {CountryFlags.map((item) => (
                                <img src={`${item.flag}?w=40&h=30&`}
                                     srcSet={`${item.flag}?w=40&h=30`}
                                     alt={item.name}
                                     loading={"lazy"}
                                     width={40}
                                     height={30}
                                     key={item.name}
                                        style={{marginRight: 8}}
                                />
                            ))}
                        </Box>

                    </Stack>
                </Paper>

            </Container>
        </Box>
    );
}