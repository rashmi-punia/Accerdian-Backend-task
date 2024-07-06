import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res)=>{
    try {
        const userClient = new PrismaClient();
        const {name, email, password} = req.body;
        const hash = bcrypt.hashSync(password,10);
        let user = await userClient.user.findUnique({where:{email}});
        if(user){
            return res.json({msg:"user already exists"}).status(400);
        } else{
            user = await userClient.user.create({data:{
                name,email,password:hash
            }});
            console.log(user);
            userClient.$disconnect();
            return res.json(user).status(201);
        }

    } catch (error) {
        console.log(error);
        return res.json({msg:"Some error occured"}).status(500);
    }
}

export const login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        const userClient = new PrismaClient();
        const user = await userClient.user.findUnique({where:{email}});
        if(user){
            const compare = bcrypt.compareSync(password, user.password);
            if(compare){
                const token = jwt.sign(user, process.env.JWT_KEY,{
                    expiresIn:"10h"
                });
                userClient.$disconnect();
                return res.json({token}).status(202);
            }
        } else{
            return res.json({msg:"user not found"}).status(404);
        }
    } catch (error) {
        console.log(error);
        return res.json({msg:"some error occured"}).status(500);
    }
}

export const refer = async(req, res)=>{
    try {
        const userClient = new PrismaClient();
        const userId = req.user.id
        const code = Math.random().toString(36).substring(2,9).toUpperCase();
        const referral = await userClient.referals.create({data:{
            userId,code
        }});
        userClient.$disconnect();
        return res.json({code}).status(201);
    } catch (error) {
        console.log(error)
        return res.json({msg:"some error occured"}).status(500);
    }
}

export const claim = async (req, res)=>{
    try {
        const userClient = new PrismaClient();
        const {code} = req.body;
        const userId = req.user.id;
        let referral = await userClient.referals.findFirst({where:{code}});
        if(referral.userId === userId){
            userClient.$disconnect();
            return res.json({msg:"cannot refer yourself"}).status(403);
        }
        if(referral.referedId !== null){
            userClient.$disconnect();
            return res.json({msg:"used referral code"}).status(403);
        } else{
            const referralId = referral.id;
            referral = await userClient.referals.update({where:{code, id:referralId}, data:{referedId:userId}});
            userClient.$disconnect();
            return res.json({msg:"referral claimed"}).status(200);
        }
    } catch (error) {
        console.log(error);
        return res.json({msg:"some error occured"}).status(500);
    }
}

export const myReferrals = async (req, res)=>{
    try {
        const userClient = new PrismaClient();
        const user = await userClient.user.findFirst({where:{id:req.user.id},include:{referals: true}});
        const referrals = user.referals;
        return res.json(referrals).status(500);
    } catch (error) {
        console.log(error);
        return res.json({msg:"some error occured"}).status(500)
    }
}