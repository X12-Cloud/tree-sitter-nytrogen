package tree_sitter_nytrogen_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_nytrogen "github.com/x12-cloud/nytrogen/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_nytrogen.Language())
	if language == nil {
		t.Errorf("Error loading Nytrogen grammar")
	}
}
