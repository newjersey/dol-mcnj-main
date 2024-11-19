"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerFactory = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const Error_1 = require("../domain/Error");
const Selector_1 = require("../domain/training/Selector");
const CareerOneStopClient_1 = require("../careeronestop/CareerOneStopClient");
const routerFactory = ({ searchTrainings, findTrainingsBy, getInDemandOccupations, getOccupationDetail, getOccupationDetailByCIP, }) => {
    const router = (0, express_1.Router)();
    router.get("/trainings/search", (req, res) => {
        searchTrainings(req.query.query)
            .then((trainings) => {
            console.log(`Successfully retrieved training programs: `, trainings);
            res.status(200).json(trainings);
        })
            .catch((error) => {
            console.error(`Error caught in catch block:`, error);
            return res.status(500).json({ error: 'Internal server error' });
        });
    });
    router.get("/trainings/:id", (req, res) => {
        findTrainingsBy(Selector_1.Selector.ID, [req.params.id])
            .then((trainings) => {
            res.status(200).json(trainings[0]);
        })
            .catch((e) => {
            if (e === Error_1.Error.NOT_FOUND) {
                res.status(404).send();
            }
            else {
                res.status(500).send();
            }
        });
    });
    router.get("/occupations", (req, res) => {
        getInDemandOccupations()
            .then((occupations) => {
            res.status(200).json(occupations);
        })
            .catch((e) => res.status(500).send(e));
    });
    router.get("/occupations/:soc", (req, res) => {
        getOccupationDetail(req.params.soc)
            .then((occupationDetail) => {
            res.status(200).json(occupationDetail);
        })
            .catch(() => res.status(500).send());
    });
    router.get("/jobcount/:term", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const sanitizedTerm = encodeURIComponent(req.params.term || "");
        const countData = yield (0, CareerOneStopClient_1.CareerOneStopClient)(process.env.CAREER_ONESTOP_BASEURL, process.env.CAREER_ONESTOP_USERID, process.env.CAREER_ONESTOP_AUTH_TOKEN)(sanitizedTerm);
        res.status(200).json({ count: countData || 0 });
    }));
    router.get("/occupations/cip/:cip", (req, res) => {
        getOccupationDetailByCIP(req.params.cip)
            .then((occupationDetails) => {
            res.status(200).json(occupationDetails);
        })
            .catch(() => res.status(500).send());
    });
    return router;
};
exports.routerFactory = routerFactory;
