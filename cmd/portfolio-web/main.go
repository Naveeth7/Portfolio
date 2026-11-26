package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"time"
)

func main() {
	const assets = "frontend/dist"
	if _, err := os.Stat(assets + "/index.html"); err != nil {
		log.Fatalf("portfolio build is missing: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	server := &http.Server{
		Addr:              net.JoinHostPort("0.0.0.0", port),
		Handler:           http.FileServer(http.Dir(assets)),
		ReadHeaderTimeout: 5 * time.Second,
	}
	log.Printf("Serving the portfolio on port %s", port)
	log.Fatal(server.ListenAndServe())
}
