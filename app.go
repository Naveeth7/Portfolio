package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
)

//go:embed frontend/src/portfolio.json
var portfolioData []byte

type Profile struct {
	Name       string       `json:"name"`
	Headline   string       `json:"headline"`
	Location   string       `json:"location"`
	Intro      string       `json:"intro"`
	GitHub     string       `json:"github"`
	LinkedIn   string       `json:"linkedin"`
	Skills     []SkillGroup `json:"skills"`
	Experience []Experience `json:"experience"`
}

type SkillGroup struct {
	Area  string   `json:"area"`
	Tools []string `json:"tools"`
}

type Experience struct {
	Company     string `json:"company"`
	Role        string `json:"role"`
	Description string `json:"description"`
}

type Project struct {
	Title       string   `json:"title"`
	Category    string   `json:"category"`
	Status      string   `json:"status,omitempty"`
	Description string   `json:"description"`
	Tools       []string `json:"tools"`
	URL         string   `json:"url,omitempty"`
}

type App struct {
	profile  Profile
	projects []Project
}

func newApp() (*App, error) {
	var data struct {
		Profile
		Projects []Project `json:"projects"`
	}
	if err := json.Unmarshal(portfolioData, &data); err != nil {
		return nil, fmt.Errorf("decode portfolio: %w", err)
	}
	return &App{profile: data.Profile, projects: data.Projects}, nil
}

func (app *App) GetProfile() Profile {
	return app.profile
}

func (app *App) GetProjects() []Project {
	return app.projects
}
