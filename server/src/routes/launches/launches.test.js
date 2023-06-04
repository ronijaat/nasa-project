const request = require("supertest");
const app = require("../../app");

const {connectMongo,
    disConnect} = require("../../../services/mongo");

describe("Testing API",()=>{
    beforeAll(async ()=>{
        await connectMongo(); 
    })

    afterAll(async ()=>{
        await disConnect(); 
    })

    describe("Test GET /launches",()=>{
        test("It should be respond with 200 sucess",async ()=>{
            const response = await request(app)
                .get("/v1/launches")
                .expect('Content-Type',/json/)
                .expect(200)
        })
    })
    
    compeletelaunch = {
        mission:"bad boy",
        rocket:"metu",
        target:"Kepler-442 b",
        launchDate:"January 18,2032"
    };
    
    compeletelaunchwithoutDate = {
        mission:"bad boy",
        rocket:"metu",
        target:"Kepler-442 b"
    };
    
    describe("Test POST /launches",()=>{
        test("It should be response with 201 sucess",async ()=>{
            const response = await request(app)
                .post("/v1/launches")
                .send(compeletelaunch)
                .expect("Content-Type",/json/)
                .expect(201)
            // it returns a object so using jest api to test
            const requestDate = new Date(compeletelaunch.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
    
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(compeletelaunchwithoutDate);
        });
    
        test("it should catch missing required launch property",async ()=>{
            const response = await request(app)
                .post("/v1/launches")
                .send(compeletelaunchwithoutDate)
                .expect("Content-Type",/json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error : "Missing required launch property"
            });
            
        });
    
        test("it should catch invalid dates", async ()=>{
            const response = await request(app)
                .post("/v1/launches")
                .send({
                    mission:"bad boy",
                    rocket:"metu",
                    target:"home",
                    launchDate:"Roni"
                })
                .expect("Content-Type",/json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: "Invalid Date"
            })
        })
    })
});

